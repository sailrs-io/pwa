import { Workbox, WorkboxLifecycleWaitingEvent } from "workbox-window";

export function registerUpdatePrompt(
  wb: Workbox,
  prompt: () => Promise<boolean>,
) {
  const showSkipWaitingPrompt = async (
    _event: WorkboxLifecycleWaitingEvent,
  ) => {
    // Assuming the user accepted the update, set up a listener
    // that will reload the page as soon as the previously waiting
    // service worker has taken control.
    wb.addEventListener("controlling", () => {
      // At this point, reloading will ensure that the current
      // tab is loaded under the control of the new service worker.
      // Depending on your web app, you may want to auto-save or
      // persist transient state before triggering the reload.
      window.location.reload();
    });

    // When `event.wasWaitingBeforeRegister` is true, a previously
    // updated service worker is still waiting.
    // You may want to customize the UI prompt accordingly.

    // This code assumes your app has a promptForUpdate() method,
    // which returns true if the user wants to update.
    // Implementing this is app-specific; some examples are:
    // https://open-ui.org/components/alert.research or
    // https://open-ui.org/components/toast.research
    const updateAccepted = await prompt();

    if (updateAccepted) {
      wb.messageSkipWaiting();
    }
  };

  // Add an event listener to detect when the registered
  // service worker has installed but is waiting to activate.
  wb.addEventListener("waiting", async (event) => {
    await showSkipWaitingPrompt(event);
  });
}
