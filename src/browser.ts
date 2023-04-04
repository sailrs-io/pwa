/// <reference lib="WebWorker" />

import { Workbox } from "workbox-window";

export type SetupBrowserOptions = {
  /** url to check for the serviceWorker */
  url: string;
  /** handle the users' choice whether he allows notifications or not */
  handlePermission?: PermissionCallback;
}

export async function registerServiceWorker({ url, promptForUpdate, handlePermission }: SetupBrowserOptions = { url: '/sw.js' }) {
  if ("Notification" in window && handlePermission) {
    if (Notification.permission !== "denied") {
      askNotificationPermission(handlePermission);
    }
  }

  if ('serviceWorker' in navigator) {
    console.log('@sailrs/pwa.registerServiceWorker')
    // @ts-expect-error
    window.addEventListener('load', () => {
      const wb = new Workbox(options.url);

      wb.addEventListener('installed', event => {
        if (!event.isUpdate) {
          console.log('Service worker installed for the first time!');
        } else {
          console.log('Service worker updated');
        }
      });

      wb.addEventListener('activated', event => {
        // `event.isUpdate` will be true if another version of the service
        // worker was controlling the page when this version was registered.
        if (!event.isUpdate) {
          console.log('Service worker activated for the first time!');
          // If your service worker is configured to precache assets, those
          // assets should all be available now.
        } else {
          console.log('Service worker activated');
        }
      });

      wb.addEventListener('waiting', event => {
        console.log(
          `A new service worker has installed, but it can't activate` +
          `until all tabs running the current version have fully unloaded.`
        );
      });

      wb.addEventListener('message', event => {
        if (event.data.type === 'CACHE_UPDATED') {
          const { updatedURL } = event.data.payload;

          console.log(`A newer version of ${updatedURL} is available!`);
        }
      });

      wb.register();
    })
  }
}
