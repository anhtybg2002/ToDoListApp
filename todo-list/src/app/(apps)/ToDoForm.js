import {
  Button,
  Paper,
  Stack,
  TextInput,
  Textarea,
  Select,
  Group,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useState } from "react";

export default function TodoForm({ initialValues, onSubmit,onDelete }) {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  console.log("initialValues:", initialValues);

  const form = useForm({
    initialValues: {
      title: initialValues?.title || "",
      description: initialValues?.description || "",
      status: initialValues?.status || "pending",
      due_date: initialValues?.due_date ? new Date(initialValues.due_date) : null, 
    },
    validate: {
      title: (val) => (val.length === 0 ? "Vui lòng nhập tiêu đề" : null),
      status: (val) => (val ? null : "Vui lòng chọn trạng thái"),
      due_date: (val) => (val instanceof Date && !isNaN(val) ? null : "Vui lòng chọn hạn chót"),
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);

    const processedValues = {
      ...values,
      due_date: values.due_date ? new Date(values.due_date).toISOString() : null, 
    };

    setTimeout(() => {
      onSubmit(processedValues);
      setLoading(false);
    }, 1000);
  };

  const handleDelete = () => {
    if (!onDelete || !initialValues) return;
    setDeleting(true);
    setTimeout(() => {
      onDelete(initialValues);
      setDeleting(false);
    }, 1000);
  };

  return (
    <Paper pl="xl" pr="xl">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Tiêu đề"
            placeholder="Nhập tiêu đề công việc"
            required
            {...form.getInputProps("title")}
          />
          <Textarea
            label="Mô tả"
            placeholder="Nhập mô tả công việc (không bắt buộc)"
            autosize
            {...form.getInputProps("description")}
          />
          <Select
            label="Trạng thái"
            data={[
              { value: "pending", label: "Chưa hoàn thành" },
              { value: "in_progress", label: "Đang thực hiện" },
              { value: "completed", label: "Đã hoàn thành" },
            ]}
            {...form.getInputProps("status")}
          />
          <DatePickerInput
            label="Hạn chót"
            placeholder="Chọn ngày hoàn thành"
            value={form.values.due_date} // Đảm bảo giá trị hợp lệ
            onChange={(date) => form.setFieldValue("due_date", date || null)}
            error={form.errors.due_date}
          />
          <Group justify="flex-end">
          {initialValues && (
              <Button color="red" onClick={handleDelete} loading={deleting}>
                Xóa công việc
              </Button>
            )}
            <Button type="submit" loading={loading}>
              {initialValues ? "Cập nhật công việc" : "Lưu công việc"}
            </Button>
            
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}

