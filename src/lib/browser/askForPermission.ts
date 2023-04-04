// https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API

/** support for safari browser */
function checkNotificationPromise() {
  try {
    Notification.requestPermission().then();
  } catch (e) {
    return false;
  }

  return true;
}

export type PermissionCallback = (permission: NotificationPermission) => void

export function askNotificationPermission(handlePermission: PermissionCallback = () => { }) {
  if (checkNotificationPromise()) {
    Notification.requestPermission().then((permission) => {
      handlePermission(permission);
    });
  } else {
    Notification.requestPermission((permission) => {
      handlePermission(permission);
    });
  }
}
