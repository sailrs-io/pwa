import { Workbox } from "workbox-window";
import {
  PermissionCallback,
  askNotificationPermission,
} from "./notifications/browser.js";
import { registerUpdatePrompt } from "./lib/registerUpdatePrompt.js";

export type SetupBrowserOptions = {
  /** url to check for the serviceWorker */
  url: string;
  /** ask the user to reload the page, or a new service worker will be stuck in `waiting`  */
  promptForUpdate?: () => Promise<boolean>;
  /** handle the users' choice whether he allows notifications or not */
  handlePermission?: PermissionCallback;
};

export function registerServiceWorker(
  { url, promptForUpdate, handlePermission }: SetupBrowserOptions = {
    url: "/sw.js",
  },
) {
  if ("Notification" in window && handlePermission) {
    if (Notification.permission !== "denied") {
      askNotificationPermission(handlePermission);
    }
  }

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      const wb = new Workbox(url);

      wb.addEventListener("installed", (event) => {
        if (!event.isUpdate) {
          console.log("Service worker installed for the first time!");
        } else {
          console.log("Service worker updated");
        }
      });

      wb.addEventListener("activated", (event) => {
        // `event.isUpdate` will be true if another version of the service
        // worker was controlling the page when this version was registered.
        if (!event.isUpdate) {
          console.debug("Service worker activated for the first time!");
          // If your service worker is configured to precache assets, those
          // assets should all be available now.
        } else {
          console.debug("Service worker activated");
        }
      });

      if (promptForUpdate) {
        registerUpdatePrompt(wb, promptForUpdate);
      } else {
        wb.addEventListener("waiting", (_event) => {
          console.debug(
            `A new service worker has installed, but it can't activate` +
              `until all tabs running the current version have fully unloaded.`,
          );
        });
      }

      wb.addEventListener("message", (event) => {
        if (event.data?.type === "CACHE_UPDATED") {
          const { updatedURL } = event.data?.payload;
          console.debug(`A newer version of ${updatedURL} is available!`);
        }
      });

      wb.register().catch((error) => console.error(error));
    });
  }
}
