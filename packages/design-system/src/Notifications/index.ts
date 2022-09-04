export { InfoBox } from "./InfoBox";
export type { InfoBoxProps } from "./InfoBox";
export { Notifications } from "./Notifications";
export { notificationState } from "./NotificationState";
export type { Notification } from "./NotificationState";

declare module "valtio" {
  function useSnapshot<T extends object>(p: T): T;
}
