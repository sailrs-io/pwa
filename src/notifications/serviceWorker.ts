/// <reference lib="webworker" />

import { handleClick, handlePush } from "./utils";

export type PushNotificationsConfig = {
  /** */
  onPush?: boolean | ((event: PushEvent) => Promise<void>);
  /** */
  onNotificationClick?: boolean | ((event: NotificationEvent) => Promise<void>);
};

export function pushNotifications({
  onPush,
  onNotificationClick,
}: PushNotificationsConfig = {}) {
  if (onPush) {
    const handle = typeof onPush === "function" ? onPush : handlePush;
    (self as unknown as ServiceWorkerGlobalScope).addEventListener(
      "push",
      (event) => event.waitUntil(handle(event)),
    );
  }

  if (onNotificationClick) {
    const handle =
      typeof onNotificationClick === "function"
        ? onNotificationClick
        : handleClick;
    (self as unknown as ServiceWorkerGlobalScope).addEventListener(
      "notificationclick",
      (event) => event.waitUntil(handle(event)),
    );
  }
}
