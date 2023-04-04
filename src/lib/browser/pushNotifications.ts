/// <reference lib="webworker" />

type PushNotificationsArgs = {
  onPush?: (event: PushEvent) => Promise<void>
}

export function pushNotifications({ onPush }: PushNotificationsArgs = {}) {
  if (onPush) {
    (self as unknown as ServiceWorkerGlobalScope)
      .addEventListener('push', (event) => event.waitUntil(onPush(event)))
  }
}
