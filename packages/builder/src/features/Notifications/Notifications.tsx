import * as React from "react";
import { Box } from "@open-decision/design-system";
import { Notification } from "./Notification";
import { useNotificationStore } from "./NotificationState";
import { AnimatePresence } from "framer-motion";

export const Notifications = () => {
  const notifications = useNotificationStore((state) => state.notifications);

  return (
    <Box
      css={{
        position: "absolute",
        zIndex: "9999",
        left: "$8",
        bottom: "$8",
        display: "grid",
        gap: "$4",
        width: "500px",
      }}
    >
      <AnimatePresence>
        {Object.entries(notifications).map(([id, notification]) => (
          <Notification key={id} id={id} notification={notification} />
        ))}
      </AnimatePresence>
    </Box>
  );
};
