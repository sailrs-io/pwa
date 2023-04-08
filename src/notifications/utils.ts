export function handlePush(event: PushEvent) {
  return new Promise<void>((resolve) => {
    if (event.data) {
      const { title, ...options } = event.data.json();
      (
        self as unknown as ServiceWorkerGlobalScope
      ).registration.showNotification(title, {
        ...options,
      });
    }
    resolve();
  });
}

export function handleClick(event: NotificationEvent) {
  return new Promise<void>((resolve) => {
    if (!event.action) {
      resolve();
    }
    // @ts-ignore
    clients.openWindow(event.action);
    resolve();
  });
}
