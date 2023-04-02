import { OfflineFallbackOptions } from "workbox-recipes"
import { WarmCacheArgs } from "../recipes/warmCache.js"
import { StrategyConfig } from "./strategies.js"
import { NetworkFirstOptions } from "workbox-strategies"
import { StaticResourcesCacheArgs } from "../recipes/staticResourcesCache.js"
import { ImageCacheArgs } from "../recipes/imageCache.js"

export type RouteConfig = {
  [key: string]: StrategyConfig
}

export type RecipeConfig = {
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
  imageCache?: Boolean | ImageCacheArgs

  /**
   * offlineFallback recipe
   *
   * @param pageFallback - The URL of the page to show when the user is offline.
   * @param imageFallback - The URL of the image to show when the user is offline.
   * @param fontFallback - The URL of the font to show when the user is offline.
   *
   * @see https://developer.chrome.com/docs/workbox/modules/workbox-recipes/#offline-fallback
   */
  offlineFallback?: OfflineFallbackOptions

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
  pageCache?: Boolean | NetworkFirstOptions

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
  staticResourcesCache?: Boolean | StaticResourcesCacheArgs

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
  warmCache?: WarmCacheArgs
}

export type Config = {
  /** configure your custom caching needs  */
  caches?: RouteConfig
  /** use preconfigured workbox recipes */
  recipes?: RecipeConfig
}
