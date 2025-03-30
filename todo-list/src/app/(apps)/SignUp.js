import {
  Button,
  Flex,
  PasswordInput,
  TextInput,
  Paper,
  Group,
  Anchor,
  Alert,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { userApi } from "../api/user";

export default function SignUp() {
  const [message, setMessage] = useState({
    title: null,
    text: null,
    color: null,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await userApi.create({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      });

      setMessage({
        title: "Thành công",
        text: "Đăng ký thành công!",
        color: "green",
      });
      form.reset();
    } catch (error) {
      setMessage({
        title: "Lỗi đăng nhập",
        text: error.response?.data?.message || error.message || "Có lỗi xảy ra",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validateInputOnBlur: true,
    validate: {
      firstName: (val) =>
        val.length === 0 ? "Vui lòng nhập tên của bạn" : null,
      lastName: (val) =>
        val.length === 0 ? "Vui lòng nhập họ và tên đệm của bạn" : null,
      email: (val) =>
        val.length === 0
          ? "Vui lòng nhập email"
          : /^\S+@\S+$/.test(val)
          ? null
          : "Địa chỉ email không hợp lệ",
      password: (val) => (val.length === 0 ? "Vui lòng nhập mật khẩu" : null),
      confirmPassword: (value, values) =>
        value !== values.password
          ? "Mật khẩu xác nhận không khớp. Vui lòng thử lại!"
          : null,
    },
  });

  return (
    <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
      <Paper p={"xl"} radius={"xs"}>
        {message.text && (
          <Alert color={message.color} title={message.title}>
            {message.text}
          </Alert>
        )}
        <Flex direction={{ base: "column", sm: "row" }} gap={{ base: "md" }}>
          <TextInput
            name="firstName"
            label="Tên"
            placeholder="Nhập tên của bạn"
            required
            {...form.getInputProps("firstName")}
          />
          <TextInput
            name="lastName"
            label="Họ"
            placeholder="Nhập họ và tên đệm"
            required
            {...form.getInputProps("lastName")}
          />
        </Flex>
        <TextInput
          name="email"
          label="Email"
          placeholder="Nhập địa chỉ email"
          required
          mt="md"
          {...form.getInputProps("email")}
        />
        <PasswordInput
          name="password"
          label="Mật khẩu"
          placeholder="Nhập mật khẩu của bạn"
          required
          mt="md"
          {...form.getInputProps("password")}
        />
        <PasswordInput
          name="confirmPassword"
          label="Xác nhận mật khẩu"
          placeholder="Nhập lại mật khẩu để xác nhận"
          required
          mt="md"
          {...form.getInputProps("confirmPassword")}
        />
        <Button fullWidth mt="xl" loading={loading} type="submit">
          Tạo tài khoản
        </Button>
        <Group justify="center" mt={"xs"}>
          <Text>Nếu chưa có tài khoản?</Text>
          <Anchor href="/login" fw={500} fz="sm">
            Đăng nhập
          </Anchor>
        </Group>
      </Paper>
    </form>
  );
}
