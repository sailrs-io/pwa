import { registerRoute } from "workbox-routing";
import { WarmCacheArgs, warmCache } from "./cache/recipes/warmCache.js";
import { offlineFallback } from "./cache/recipes/offlineFallback.js";
import { pageCache } from "./cache/recipes/pageCache.js";
import {
  StaticResourcesCacheArgs,
  staticResourcesCache,
} from "./cache/recipes/staticResourcesCache.js";
import { ImageCacheArgs, imageCache } from "./cache/recipes/imageCache.js";
import { StrategyConfig, getStrategy } from "./cache/strategies.js";
import {
  PushNotificationsConfig,
  pushNotifications,
} from "../notifications/serviceWorker.js";

import { OfflineFallbackOptions } from "workbox-recipes";
import { NetworkFirstOptions } from "workbox-strategies";

type RouteConfig = {
  [key: string]: StrategyConfig;
};

type RecipeConfig = {
  /**
   * imageCache recipe
   * ```js`
   * config: {
   *   match: ({ request }) => request.destination === 'image',
   *   strategy: 'staleWhileRevalidate',
   *   cacheableResponses: {
   *     statuses: [0, 200]
   *   },
   *   expiration: {
   *     maxAgeSeconds: 30 * 24 * 60 * 60, // 60 days
   *     maxEntries: 60
   *   },
   * }
   * ```
   *
   * @see https://developer.chrome.com/docs/workbox/modules/workbox-recipes/#image-cache
   */
  imageCache?: boolean | ImageCacheArgs;

  /**
   * offlineFallback recipe
   *
   * @param pageFallback - The URL of the page to show when the user is offline.
   * @param imageFallback - The URL of the image to show when the user is offline.
   * @param fontFallback - The URL of the font to show when the user is offline.
   *
   * @see https://developer.chrome.com/docs/workbox/modules/workbox-recipes/#offline-fallback
   */
  offlineFallback?: OfflineFallbackOptions;

  /**
   * pageCache recipes
   * ```js
   * config: {
   *   match: ({request}) => request.mode === 'navigate',
   *   strategy: 'networkFirst',
   *   networkTimeoutSeconds: 3,
   *   cacheableResponses: {
   *     statuses: [0, 200]
   *   },
   * }
   * ```
   *
   * @see https://developer.chrome.com/docs/workbox/modules/workbox-recipes/#page-cache
   */
  pageCache?: boolean | NetworkFirstOptions;

  /**
   * staticResourcesCache recipe
   *
   * ```js
   * config: {
   *   match: ({request}) => ['style', 'script', 'worker'].includes(request.destination),
   *   strategy: 'staleWhileRevalidate',
   *   cacheableResponses: {
   *     statuses: [0, 200]
   *   },
   * }
   * ```
   *
   * @see https://developer.chrome.com/docs/workbox/modules/workbox-recipes/#static-resources-cache
   */
  staticResourcesCache?: boolean | StaticResourcesCacheArgs;

  /**
   * warmCache recipe
   * ```js
   * config: {
   *   strategy: 'cacheFirst',
   *   urls: [],
   * }
   * ```
   *
   * @see https://developer.chrome.com/docs/workbox/modules/workbox-recipes/#static-resources-cache
   */
  warmCache?: WarmCacheArgs;
};

export type Config = {
  /** configure your custom caching needs  */
  caches?: RouteConfig;
  /** use preconfigured workbox recipes */
  recipes?: RecipeConfig;
  /** handle push notifications  */
  pushNotifications?: PushNotificationsConfig;
};
const isBoolean = (value: any): value is boolean => typeof value === "boolean";

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
    "message",
    (event) => {
      if (event?.data && event.data?.type === "SKIP_WAITING") {
        (self as unknown as ServiceWorkerGlobalScope).skipWaiting();
      }
    },
  );
}
