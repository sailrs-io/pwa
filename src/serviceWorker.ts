import { ImageCacheOptions, OfflineFallbackOptions, PageCacheOptions, StaticResourceOptions, offlineFallback, pageCache, staticResourceCache } from "workbox-recipes";
import { imageCache } from "./recipes/imageCache.js";

type OfflineCacheConfig = {
  pageFallback: OfflineFallbackOptions['pageFallback']
  imageFallback?: OfflineFallbackOptions['imageFallback']
}

type StaticResourcesCacheConfig = StaticResourceOptions;

export type Config = {
  imageCache?: ImageCacheOptions
  offlineCache?: OfflineCacheConfig
  pageCache?: PageCacheOptions
  staticResourcesCache?: StaticResourcesCacheConfig
}

export function setupServiceWorker(config: Config = {}) {

  staticResourceCache(config.staticResourcesCache)

  if (config.pageCache) {
    pageCache(config.pageCache)
  }

  // user has to provide a working `pageFallback`. Otherwise a 404 may prevent
  // worker from registering
  if (config.offlineCache?.pageFallback) {
    offlineFallback(config.offlineCache)
  }

  if (config.imageCache) {
    imageCache(config.imageCache)
  }
}
