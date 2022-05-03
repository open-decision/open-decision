import {
  Box,
  Heading,
  Icon,
  Stack,
  styled,
  StyleObject,
  Text,
} from "@open-decision/design-system";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { Notification } from "./NotificationState";

const Container = styled(Box, {
  $$accentColor: "$colors$colorScheme11",
  borderRadius: "$md",
  backgroundColor: "$white",

  defaultVariants: {
    variant: "neutral",
  },
});

const icons = {
  danger: CrossCircledIcon,
  info: InfoCircledIcon,
  success: CheckCircledIcon,
  warning: ExclamationTriangleIcon,
} as const;

export type InfoBoxProps = {
  children?: React.ReactNode;
  CloseButton?: React.ReactNode;
  css?: StyleObject;
} & Omit<Notification, "duration">;

export function InfoBox({
  children,
  content,
  title,
  variant,
  CloseButton,
  css,
}: InfoBoxProps) {
  const IconSVG = icons[variant];

  return (
    <Container css={{ colorScheme: variant, ...css }} role="alert">
      <Stack
        css={{
          padding: "$5",
          flexDirection: "row",
          gap: "$5",
          alignItems: "center",
        }}
      >
        <Icon
          css={{
            marginBottom: "-2px",
            backgroundColor: "$colorScheme3",
            borderRadius: "$full",
            width: "$5",
            height: "$5",
            padding: "$3",
            color: "$$accentColor",
          }}
        >
          <IconSVG />
        </Icon>
        <Stack css={{ gap: "$1", flex: 1 }}>
          <Heading size="extra-small">{title}</Heading>
          <Text>{content}</Text>
        </Stack>
        {CloseButton}
      </Stack>
      {children}
    </Container>
  );
}
