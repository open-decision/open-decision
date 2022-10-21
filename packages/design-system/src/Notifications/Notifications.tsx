import { Notification } from "../Notifications/Notification";
import { AnimatePresence } from "framer-motion";
import { Box } from "../Box";
import type { NotificationState } from "../Notifications/NotificationState";

type NotificationsProps = { state: NotificationState; closeLabel?: string };

export function Notifications({ state, closeLabel }: NotificationsProps) {
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
        {Object.entries(state.notifications).map(([id, notification]) => (
          <Notification
            closeLabel={closeLabel}
            key={id}
            id={id}
            notification={notification}
            removeNotification={state.removeNotification}
          />
        ))}
      </AnimatePresence>
    </Box>
  );
}
