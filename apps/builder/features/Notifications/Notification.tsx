import React, { useEffect } from "react";
import { styled, Icon, Button } from "@open-decision/design-system";
import {
  Notification as NotificationType,
  useNotificationStore,
} from "./NotificationState";
import * as Progress from "@radix-ui/react-progress";
import { motion, useAnimation } from "framer-motion";
import { Cross2Icon } from "@radix-ui/react-icons";
import { InfoBox } from "./InfoBox";

type NotificationProps = {
  notification: NotificationType;
  id: string;
};

const ProgressBar = styled(Progress.Root, {
  height: 3,
  margin: "0px 4px 4px 4px",
});

const ProgressIndicator = styled(Progress.Indicator, {
  height: "100%",
  backgroundColor: "$$accentColor",
  borderRadius: "$md",
});

export const Notification = ({ notification, id }: NotificationProps) => {
  const animation = useAnimation();

  const duration =
    notification.duration === "persistent" ? 5 : notification.duration;

  useEffect(() => {
    if (notification.duration === "persistent") {
      return animation.stop();
    }

    animation.start("empty");
  }, [notification.duration]);

  const removeNotification = useNotificationStore(
    (state) => state.removeNotification
  );

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
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      onPointerEnter={() => animation.stop()}
      onPointerLeave={() => animation.start("empty")}
      onClick={() => animation.set("full")}
      onFocus={() => animation.stop()}
      onBlur={() => animation.start("empty")}
    >
      <InfoBox
        CloseButton={
          <Button
            square
            variant="neutral"
            onClick={() => removeNotification(id)}
          >
            <Icon label="Benachrichtigung schließen">
              <Cross2Icon />
            </Icon>
          </Button>
        }
        css={{ boxShadow: "$6" }}
        {...notification}
      >
        <motion.div
          variants={progress}
          transition={{ duration }}
          initial="full"
          animate={animation}
          onAnimationComplete={() => removeNotification(id)}
        />
      </InfoBox>
    </motion.div>
  );
};
