import { Button, Grid, Group, Paper, Stack, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useState, useEffect } from "react";
import TodoForm from "./ToDoForm";
import { todoApi } from "../api/todo";
import LetterAvatar from "./LetterAvatar";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      fetchTodos();
    }
  }, [token, searchTerm]); // Tự động load lại danh sách khi searchTerm thay đổi

  if (!token) {
    return (
      <p style={{ color: "red" }}>
        Không tìm thấy token, vui lòng đăng nhập lại!
      </p>
    );
  }

  const fetchTodos = async () => {
    try {
      const query = searchTerm
        ? `?title=${encodeURIComponent(searchTerm)}`
        : "";
      const response = await todoApi.getAll(token, query);
      setTodos(response);
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (todo) => {
    modals.open({
      title: todo ? "Chỉnh sửa công việc" : "Thêm mới công việc",
      centered: true,
      children: (
        <TodoForm
          initialValues={todo}
          onSubmit={(updatedTodo) => {
            if (todo) {
              todoApi
                .update(todo._id, updatedTodo, token)
                .then((response) => {
                  setTodos((prev) =>
                    prev.map((t) => (t._id === todo._id ? response : t))
                  );
                })
                .catch(console.error);
            } else {
              todoApi
                .create(updatedTodo, token)
                .then((response) => setTodos((prev) => [...prev, response]))
                .catch(console.error);
            }
            modals.closeAll();
          }}
          onDelete={(deletedTodo) => {
            modals.openConfirmModal({
              title: "Xác nhận xóa",
              children: <p>Bạn có chắc muốn xóa công việc này không?</p>,
              labels: { confirm: "Xóa", cancel: "Hủy" },
              confirmProps: { color: "red" },
              onConfirm: () => {
                todoApi
                  .delete(deletedTodo._id, token)
                  .then(() =>
                    setTodos((prev) =>
                      prev.filter((t) => t._id !== deletedTodo._id)
                    )
                  )
                  .catch(console.error);
                modals.closeAll();
              },
            });
          }}
        />
      ),
    });
  };

  return (
    <Stack h="100vh" w="100%" p="lg">
      <Group justify="space-between">
        <LetterAvatar />
        <TextInput
          placeholder="Tìm kiếm công việc..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") fetchTodos();
          }}
        />
        <Button onClick={() => openModal(null)}>Thêm mới</Button>
      </Group>
      <Grid h="100%">
        {[
          {
            title: "Chưa hoàn thành ⏳",
            tasks: todos.filter((t) => t.status === "pending"),
          },
          {
            title: "Đang thực hiện 🔄",
            tasks: todos.filter((t) => t.status === "in_progress"),
          },
          {
            title: "Đã hoàn thành ✅",
            tasks: todos.filter((t) => t.status === "completed"),
          },
        ].map((column, index) => (
          <Grid.Col key={index} span={4} style={{ flexGrow: 1 }}>
            <Paper
              p="xl"
              radius="md"
              shadow="xs"
              withBorder
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <h3>{column.title}</h3>
              {column.tasks.length > 0 ? (
                column.tasks.map((todo) => (
                  <TodoCard key={todo._id} todo={todo} onEdit={openModal} />
                ))
              ) : (
                <p>Không có công việc nào.</p>
              )}
            </Paper>
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  );
}

function TodoCard({ todo, onEdit }) {
  return (
    <Paper
      p="md"
      radius="sm"
      shadow="xs"
      withBorder
      mt="sm"
      onClick={() => onEdit(todo)}
      style={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        height: "230",
      }}
    >
      <strong>{todo.title}</strong>
      <p
        style={{
          flexGrow: 1,
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 2,
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {todo.description || "Không có mô tả"}
      </p>
      <p>
        Hạn chót:{" "}
        {todo.due_date
          ? new Date(todo.due_date).toLocaleDateString("vi-VN")
          : "Chưa đặt"}
      </p>
      {todo.status === "completed" && todo.updated_at && (
        <p>
          Hoàn thành lúc: {new Date(todo.updated_at).toLocaleString("vi-VN")}
        </p>
      )}
    </Paper>
  );
}
