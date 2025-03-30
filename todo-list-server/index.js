require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const logger = require("./logger");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Kết nối MongoDB thành công!"))
  .catch((err) => console.error("Lỗi kết nối MongoDB:", err));

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const todoSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["pending", "in_progress", "completed"],
    default: "pending",
  },
  due_date: { type: Date, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

todoSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

const ToDo = mongoose.model("ToDo", todoSchema);
const User = mongoose.model("User", userSchema);

app.post("/register", async (req, res) => {
  try {
    const { email, password, lastName, firstName } = req.body;
    logger.info(`[SIGNUP] Data: ${JSON.stringify(req.body)}`);
    console.log(req.body);
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email đã tồn tại!" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      lastName,
      firstName,
    });
    await newUser.save();

    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    logger.info(`[LOGIN] User: Data: ${JSON.stringify(req.body)}`);
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email không tồn tại!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Mật khẩu không đúng!" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Đăng nhập thành công!", token });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
});

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token)
    return res.status(401).json({ message: "Không có quyền truy cập!" });

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token không hợp lệ!" });
  }
};

app.get("/todos", authMiddleware, async (req, res) => {
  try {
    const { title } = req.query;
    const filter = { user_id: req.userId };
    logger.info(
      `[QUERY TODO] User: ${req.userId}, Query: ${JSON.stringify(req.query)}`
    );

    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }

    const todos = await ToDo.find(filter);
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách ToDo", error });
  }
});

app.post("/todos", authMiddleware, async (req, res) => {
  try {
    const { title, description, status, due_date } = req.body;
    logger.info(
      `[CREATE TODO] User: ${req.userId}, Data: ${JSON.stringify(req.body)}`
    );
    const newTodo = new ToDo({
      user_id: req.userId,
      title,
      description,
      status,
      due_date,
    });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tạo ToDo", error });
  }
});

app.put("/todos/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description, status, due_date } = req.body;
    logger.info(
      `[UPDATE TODO] User: ${req.userId}, Data: ${JSON.stringify(req.body)}`
    );
    const todoId = req.params.id;
    const userId = req.userId;

    const dueDateValue = due_date ? new Date(due_date) : null;

    const updatedTodo = await ToDo.findOneAndUpdate(
      { _id: todoId, user_id: userId },
      {
        title,
        description,
        status,
        due_date: dueDateValue,
        updated_at: new Date(),
      },
      { new: true }
    );

    if (!updatedTodo) {
      return res
        .status(404)
        .json({ message: "ToDo không tồn tại hoặc không có quyền cập nhật!" });
    }

    res.json(updatedTodo);
  } catch (error) {
    console.error("Lỗi khi cập nhật ToDo:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật ToDo", error });
  }
});

app.delete("/todos/:id", authMiddleware, async (req, res) => {
  try {
    logger.info(
      `[DELETE TODO] User: ${req.userId}, Data: ${JSON.stringify(req.body)}`
    );
    const deletedTodo = await ToDo.findOneAndDelete({
      _id: req.params.id,
      user_id: req.userId,
    });

    if (!deletedTodo)
      return res.status(404).json({ message: "ToDo không tồn tại!" });

    res.json({ message: "ToDo đã được xóa!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa ToDo", error });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));
