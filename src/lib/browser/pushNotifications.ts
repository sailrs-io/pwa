/// <reference lib="webworker" />

type PushNotificationsArgs = {
  /** */
  onPush?: (event: PushEvent) => Promise<void>
  /** */
  onNotificationClick?: (event: NotificationEvent) => Promise<void>
}

function handlePush(event: PushEvent) {
  return new Promise<void>((resolve) => {
    if (event.data) {
      const { title, ...options } = event.data.json();
      (self as unknown as ServiceWorkerGlobalScope).registration.showNotification(title, {
        ...options,
      });
    }
    resolve()
  })
}

function handleClick(event: NotificationEvent) {
  return new Promise<void>((resolve) => {
    if (!event.action) {
      resolve()
    }
    // @ts-ignore
    clients.openWindow(event.action)
    resolve()
  })
}

export function pushNotifications({ onPush, onNotificationClick }: PushNotificationsArgs = {}) {
  if (onPush) {
    const handle = typeof onPush === 'function' ? onPush : handlePush;
    (self as unknown as ServiceWorkerGlobalScope)
      .addEventListener('push', (event) => event.waitUntil(handle(event)))
  }

  if (onNotificationClick) {
    const handle = typeof onNotificationClick === 'function' ? onNotificationClick : handleClick;
    (self as unknown as ServiceWorkerGlobalScope)
      .addEventListener('notificationclick', (event) => event.waitUntil(handle(event)))
  }
}
