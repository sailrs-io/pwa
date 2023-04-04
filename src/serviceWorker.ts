import { registerRoute } from "workbox-routing";
import { Config } from "./lib/types/routes.js";
import { WarmCacheArgs } from "./lib/recipes/warmCache.js";

const isBoolean = (value: any): value is Boolean => typeof value === 'boolean'

export function setupServiceWorker(config: Config = {}) {
  if (config.recipes?.pageCache) {
    const opts = isBoolean(config.recipes?.pageCache) ? {} : config.recipes?.pageCache
    import("./lib/recipes/pageCache.js").then(({ pageCache }) => pageCache(opts))
  }

  if (config.recipes?.offlineFallback) {
    const opts = isBoolean(config.recipes?.offlineFallback) ? {} : config.recipes?.offlineFallback
    import("./lib/recipes/offlineFallback.js").then(({ offlineFallback }) => offlineFallback(opts))
  }

  if (config.recipes?.warmCache) {
    import("./lib/recipes/warmCache.js").then(({ warmCache }) => warmCache(config.recipes?.warmCache as WarmCacheArgs))
  }


  if (config.recipes?.staticResourcesCache) {
    const opts = isBoolean(config.recipes?.staticResourcesCache) ? {} : config.recipes?.staticResourcesCache
    import("./lib/recipes/staticResourcesCache.js").then(({ staticResourcesCache }) => staticResourcesCache(opts))
  }

  if (config.recipes?.imageCache) {
    const opts = isBoolean(config.recipes?.imageCache) ? {} : config.recipes?.imageCache
    import("./lib/recipes/imageCache.js").then(({ imageCache }) => imageCache(opts))
  }

  if (config.caches) {
    Object.entries(config.caches).forEach(async ([cacheName, options]) => {
      const strategy = await import("./lib/strategies.js").then(({ getStrategy }) => getStrategy({ cacheName, ...options }))
      registerRoute(options.match, strategy)
    })
  }

  if (config.pushNotifications) {
    import("./lib/browser/pushNotifications.js").then(({ pushNotifications }) => pushNotifications(config.pushNotifications))
  }

  // register a SKIP_WAITING message handler which can be triggered via Workbox.messageSkipWaiting()
  (self as unknown as ServiceWorkerGlobalScope).addEventListener('message', (event) => {
    if (event?.data && event.data?.type === 'SKIP_WAITING') {
      (self as unknown as ServiceWorkerGlobalScope).skipWaiting()
    }
  })
}
