import { Notification } from "../Notifications/Notification";
import { AnimatePresence } from "framer-motion";
import {
  NotificationState,
  removeNotification,
} from "../Notifications/NotificationState";

type NotificationsProps = { state: NotificationState; closeLabel?: string };

export function Notifications({ state, closeLabel }: NotificationsProps) {
  return (
    <div className="absolute z-50 left-8 bottom-8 grid gap-4 w-[500px]">
      <AnimatePresence>
        {Object.entries(state.notifications).map(([id, notification]) => (
          <Notification
            closeLabel={closeLabel}
            key={id}
            id={id}
            notification={notification}
            removeNotification={removeNotification}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
