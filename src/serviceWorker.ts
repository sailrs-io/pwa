import { registerRoute } from 'workbox-routing';
import { Config } from './lib/types/routes.js';
import { WarmCacheArgs, warmCache } from './lib/cache/recipes/warmCache.js';
import { offlineFallback } from './lib/cache/recipes/offlineFallback.js';
import { pageCache } from './lib/cache/recipes/pageCache.js';
import { staticResourcesCache } from './lib/cache/recipes/staticResourcesCache.js';
import { imageCache } from './lib/cache/recipes/imageCache.js';
import { getStrategy } from './lib/cache/strategies.js';
import { pushNotifications } from './lib/notifications/pushNotifications.js';

const isBoolean = (value: any): value is Boolean => typeof value === 'boolean';

export function setupServiceWorker(config: Config = {}) {
  if (config.recipes?.pageCache) {
    const opts = isBoolean(config.recipes?.pageCache)
      ? {}
      : config.recipes?.pageCache;
    pageCache(opts);
  }

  if (config.recipes?.offlineFallback) {
    const opts = isBoolean(config.recipes?.offlineFallback)
      ? {}
      : config.recipes?.offlineFallback;
    offlineFallback(opts);
  }

  if (config.recipes?.warmCache) {
    warmCache(config.recipes?.warmCache as WarmCacheArgs);
  }

  if (config.recipes?.staticResourcesCache) {
    const opts = isBoolean(config.recipes?.staticResourcesCache)
      ? {}
      : config.recipes?.staticResourcesCache;
    staticResourcesCache(opts);
  }

  if (config.recipes?.imageCache) {
    const opts = isBoolean(config.recipes?.imageCache)
      ? {}
      : config.recipes?.imageCache;
    imageCache(opts);
  }

  if (config.caches) {
    Object.entries(config.caches).forEach(async ([cacheName, options]) => {
      const strategy = getStrategy({ cacheName, ...options });
      registerRoute(options.match, strategy);
    });
  }

  if (config.pushNotifications) {
    pushNotifications(config.pushNotifications);
  }

  // register a SKIP_WAITING message handler which can be triggered via Workbox.messageSkipWaiting()
  (self as unknown as ServiceWorkerGlobalScope).addEventListener(
    'message',
    (event) => {
      if (event?.data && event.data?.type === 'SKIP_WAITING') {
        (self as unknown as ServiceWorkerGlobalScope).skipWaiting();
      }
    },
  );
}
