import * as React from "react";
import { Box } from "@open-legal-tech/design-system";
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
        right: "25px",
        bottom: "25px",
        display: "grid",
        gap: "$4",
        width: "clamp(250px, 20vw, 400px)",
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
