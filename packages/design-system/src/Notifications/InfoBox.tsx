import {
  CheckCircledIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { Required } from "utility-types";
import { Heading } from "../Heading/Heading";
import { Icon } from "../Icon/Icon";
import { Row, Stack } from "../Layout";
import { Text } from "../Text/Text";
import { Notification } from "../Notifications/NotificationState";
import { twMerge } from "../utils";

const containerClasses = "rounded-md bg-white";

const icons = {
  danger: CrossCircledIcon,
  info: InfoCircledIcon,
  success: CheckCircledIcon,
  warning: ExclamationTriangleIcon,
} as const;

export type InfoBoxProps = {
  children?: React.ReactNode;
  CloseButton?: React.ReactNode;
  className?: string;
} & Required<Omit<Notification, "duration">, "variant">;

export function InfoBox({
  children,
  content,
  title,
  variant,
  CloseButton,
  className,
}: InfoBoxProps) {
  const IconSVG = icons[variant];

  return (
    <div
      className={
        className
          ? twMerge(containerClasses, `colorScheme-${variant}`, className)
          : containerClasses
      }
      role="alert"
    >
      <Row className="p-5 gap-5 items-center">
        <Icon
          className={`bg-colorScheme3 rounded-full w-8 h-8 text-colorScheme10`}
        >
          <IconSVG />
        </Icon>
        <Stack className="flex-1 gap-1">
          <Heading size="extra-small">{title}</Heading>
          {content ? (
            typeof content === "string" ? (
              <Text>{content}</Text>
            ) : (
              content
            )
          ) : null}
        </Stack>
        {CloseButton}
      </Row>
      {children}
    </div>
  );
}
