import { CacheFirst, CacheOnly, NetworkFirst, NetworkOnly, StaleWhileRevalidate, } from "workbox-strategies"
import { getPlugin } from "./plugins.js"
import { WorkboxPlugin } from "workbox-core/types.js"
import { Strategies } from "../types/strategies.js"

// const strategyPlugins = ['backgroundSync', 'broadcastUpdate', 'cacheableResponses', 'expiration', 'rangeRequests'] as const

export function getStrategy(args: Strategies & { cacheName: string }) {
  const plugins: WorkboxPlugin[] = []

  if (args.expiration) {
    plugins.push(getPlugin({ name: 'expiration', options: args.expiration }))
  }

  if (args.cacheableResponses) {
    plugins.push(getPlugin({ name: 'cacheableResponses', options: args.cacheableResponses }))
  }

  if (args.backgroundSync) {
    plugins.push(getPlugin({ name: 'backgroundSync', options: args.backgroundSync }))
  }

  if (args.rangeRequests) {
    plugins.push(getPlugin({ name: 'rangeRequests' }))
  }

  if (args.broadcastUpdate) {
    plugins.push(getPlugin({ name: 'broadcastUpdate', options: args.broadcastUpdate }))
  }

  switch (args.strategy) {
    case 'cacheFirst':
      return new CacheFirst({ cacheName: args.cacheName, plugins })
    case 'cacheOnly':
      return new CacheOnly({ cacheName: args.cacheName, plugins })
    case 'networkFirst':
      return new NetworkFirst({ cacheName: args.cacheName, plugins, networkTimeoutSeconds: args.networkTimeoutSeconds })
    case 'networkOnly':
      return new NetworkOnly({ plugins, networkTimeoutSeconds: args.networkTimeoutSeconds })
    case 'staleWhileRevalidate':
      return new StaleWhileRevalidate({ cacheName: args.cacheName, plugins })
  }
}
