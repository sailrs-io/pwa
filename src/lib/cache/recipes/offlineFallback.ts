import {
  OfflineFallbackOptions,
  offlineFallback as originalOfflineFallback,
} from 'workbox-recipes';
import { setDefaultHandler } from 'workbox-routing';
import { NetworkOnly } from 'workbox-strategies';

export function offlineFallback(config: OfflineFallbackOptions) {
  setDefaultHandler(new NetworkOnly());
  originalOfflineFallback(config);
}
