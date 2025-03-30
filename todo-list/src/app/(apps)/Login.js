import {
  Alert,
  Anchor,
  Button,
  Checkbox,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import classes from "./SigninForm.module.css";
import { userApi } from "../api/user";

export default function Login() {
  const [message, setMessage] = useState({ title: null, text: null, color: null });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validateInputOnBlur: true,
    validate: {
      email: (val) =>
        val.length === 0
          ? "Vui lòng nhập email"
          : /^\S+@\S+$/.test(val)
          ? null
          : "Địa chỉ email không hợp lệ",
      password: (val) => (val.length === 0 ? "Vui lòng nhập mật khẩu" : null),
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    setMessage({ title: null, text: null, color: null });

    try {
      const response = await userApi.login(values);

      localStorage.setItem("token", response.token);

      setMessage({ title: "Thành công", text: "Đăng nhập thành công!", color: "green" });

      // Chờ một chút rồi điều hướng
      setTimeout(() => navigate("/home"), 1000);
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      
      setMessage({
        title: "Lỗi đăng nhập",
        text: error.response?.data?.message || error.message || "Có lỗi xảy ra",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper className={classes.card}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {message.text && (
            <Alert color={message.color} title={message.title}>
              {message.text}
            </Alert>
          )}
          <Text ta="center" mt="md">
            Tạo tài khoản để tiếp tục
          </Text>
          <TextInput
            name="email"
            label="Email"
            placeholder="Nhập địa chỉ email"
            required
            {...form.getInputProps("email")}
          />
          <PasswordInput
            id="password"
            name="password"
            label="Mật khẩu"
            placeholder="Nhập mật khẩu của bạn"
            required
            {...form.getInputProps("password")}
          />
          <Group justify="space-between">
            <Checkbox label="Ghi nhớ tôi" />
            <Anchor href="/auth/forgot-password" fw={500} fz="sm">
              Quên mật khẩu?
            </Anchor>
          </Group>
          <Button variant="filled" type="submit" loading={loading} fullWidth mt="md">
            Đăng nhập
          </Button>
          <Group justify="center">
            <Text>Nếu chưa có tài khoản?</Text>
            <Anchor href="/signup" fw={500} fz="sm">
              Đăng ký
            </Anchor>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}
