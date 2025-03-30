import {
  Group,
  Menu,
  Stack,
  Divider,
  Anchor,
  Button,
  Avatar,
  rem,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconChevronDown,
  IconCircleHalf2,
  IconMoonStars,
  IconPower,
  IconSunHigh,
  IconUserCircle,
  IconUserCode,
} from "@tabler/icons-react";
import { useMemo } from "react";

var avatarColors = [
  "red",
  "pink",
  "grape",
  "violet",
  "indigo",
  "blue",
  "cyan",
  "green",
  "lime",
  "yellow",
  "orange",
  "teal",
];

export const toColor = (name) => {
  if (!name) return "cyan";

  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }

  return avatarColors[sum % avatarColors.length] || "cyan";
};

export const getStatusColor = (status) => {
  if (!status) return "blue";

  switch (status) {
    case "active":
    case "approved":
      return "green";
    case "pending":
      return "orange";
    case "draft":
    case "inactive":
      return "gray";
    case "banned":
    case "deleted":
    case "suspend":
    case "rejected":
      return "red";
    default:
      return "blue";
  }
};

const LetterAvatar = ({ name, color, size, url, style, ...others }) => {
  const { setColorScheme } = useMantineColorScheme();
  const c = useMemo(() => color || toColor(name), [color, name]);

  return (
    <Menu shadow="lg" width={200} trigger="click-hover" withArrow>
      <Menu.Target>
        <Button
          variant="transparent"
          component="a"
          leftSection={
            <Avatar
              src={url}
              alt={name}
              color={c}
              size={size}
              style={{ borderRadius: "50%", ...style }}
              {...others}
            ></Avatar>
          }
          rightSection={<IconChevronDown size={14} />}
          h="auto"
          p={0}
          c="dimmed"
          lh="lg"
          maw={168}
        ></Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label tt="uppercase" ta="center" fw={600}>
          Xin chào
        </Menu.Label>
        <Menu.Divider />
        <Menu.Label tt="uppercase" ta="center" fw={600}>
          Chọn cách phối màu
        </Menu.Label>
        <Menu.Item
          leftSection={<IconSunHigh size={16} />}
          onClick={() => setColorScheme("light")}
        >
          Sáng
        </Menu.Item>
        <Menu.Item
          leftSection={<IconMoonStars size={16} />}
          onClick={() => setColorScheme("dark")}
        >
          Tối
        </Menu.Item>
        <Menu.Item
          leftSection={<IconCircleHalf2 size={16} />}
          onClick={() => setColorScheme("auto")}
        >
          Màu hệ thống
        </Menu.Item>
        <Menu.Divider />
        {/* <Menu.Item leftSection={<IconLockAccess size={16} />}>{t("header.lockScreen")}</Menu.Item> */}
        <Menu.Item
          leftSection={<IconPower size={16} />}
          onClick={() => {
            localStorage.removeItem("token");
            window.location.reload();
          }}
        >
          Thoát
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
export default LetterAvatar;
