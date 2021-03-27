import React from "react";
import { styled } from "utils/stitches.config";
import { Notification } from "./Notification";
import { useNotificationStore } from "./NotificationState";
import { AnimatePresence } from "framer-motion";

const NotificationWrapper = styled("div", {
  display: "grid",
  gap: "$4",
  width: "400px",
  height: "100px",
});

type Notifications = React.ComponentProps<typeof NotificationWrapper>;

export const Notifications: React.FC<Notifications> = (props) => {
  const notifications = useNotificationStore((state) => state.notifications);

  return (
    <NotificationWrapper {...props}>
      <AnimatePresence>
        {Object.entries(notifications).map(([id, notification]) => (
          <Notification key={id} id={id} notification={notification} />
        ))}
      </AnimatePresence>
    </NotificationWrapper>
  );
};
