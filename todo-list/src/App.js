import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./app/(apps)/Login";
import SignUp from "./app/(apps)/SignUp";
import Home from "./app/(apps)/Home";
import classes from "./App.module.css";

function PrivateRoute({ element }) {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/login" replace />;
}

function App() {
  return (
    <div className={classes.App}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
