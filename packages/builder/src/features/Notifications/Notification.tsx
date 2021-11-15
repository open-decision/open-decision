import React, { useEffect } from "react";
import {
  styled,
  IconButton,
  Box,
  Text,
  Heading,
  Icon,
} from "@open-legal-tech/design-system";
import { notification, useNotificationStore } from "./NotificationState";
import * as Progress from "@radix-ui/react-progress";
import { motion, useAnimation } from "framer-motion";
import { useGesture } from "react-use-gesture";
import { Info, XCircle, CheckCircle, HelpCircle, X } from "react-feather";

const icons = {
  error: XCircle,
  info: HelpCircle,
  success: CheckCircle,
  warning: Info,
} as const;

type NotificationProps = {
  notification: notification;
  id: string;
};

const Container = styled(motion.div, {
  $color: "$colors$colorScheme11",
  boxShadow: "$5",
  borderRadius: "$md",
  backgroundColor: "$colorScheme3",
  color: "var(--color)",

  defaultVariants: {
    variant: "neutral",
  },
});

const Header = styled("header", {
  display: "flex",
  alignItems: "center",
  gap: "$3",
});

const ProgressBar = styled(Progress.Root, {
  height: 3,
});

const ProgressIndicator = styled(Progress.Indicator, {
  height: "100%",
  backgroundColor: "currentColor",
});

export const Notification = ({ notification, id }: NotificationProps) => {
  const animation = useAnimation();

  useEffect(() => {
    animation.start("empty");
  }, []);

  const IconSVG = icons[notification.variant];
  const removeNotification = useNotificationStore(
    (state) => state.removeNotification
  );

  const gestures = useGesture({
    onPointerEnter: () => animation.stop(),
    onPointerLeave: () => animation.start("empty"),
    onClick: () => animation.set("full"),
    onFocus: () => animation.stop(),
    onBlur: () => animation.start("empty"),
  });

  const progress = {
    full: { width: "100%" },
    empty: { width: "0%" },
  };

  const container = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  return (
    <Container
      variants={container}
      initial="hidden"
      animate="visible"
      exit="exit"
      css={{ colorScheme: notification.variant }}
      role="alert"
      {...gestures()}
    >
      <ProgressBar>
        <ProgressIndicator
          as={motion.div}
          variants={progress}
          transition={{ duration: notification.duration }}
          initial="full"
          animate={animation}
          onAnimationComplete={() => removeNotification(id)}
        />
      </ProgressBar>
      <Box css={{ padding: "$5" }}>
        <Header>
          <Icon css={{ marginBottom: "-2px" }}>
            <IconSVG />
          </Icon>
          <Heading size="small" css={{ flex: 1 }}>
            {notification.title}
          </Heading>
          <IconButton
            alignByContent="right"
            variant="ghost"
            onClick={() => removeNotification(id)}
            label="Benachrichtigung schließen"
            Icon={<X />}
          />
        </Header>
        <Text css={{ marginTop: "$2" }}>{notification.content}</Text>
      </Box>
    </Container>
  );
};
