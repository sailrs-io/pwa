import { BackgroundSyncPlugin } from "workbox-background-sync"
import { BroadcastUpdatePlugin } from "workbox-broadcast-update"
import { CacheableResponsePlugin } from "workbox-cacheable-response"
import { ExpirationPlugin } from "workbox-expiration"
import { RangeRequestsPlugin } from "workbox-range-requests"
import { Plugins } from "./types/plugins.js"

export function getPlugin(args: Plugins) {
  switch (args.name) {
    case 'backgroundSync':
      return new BackgroundSyncPlugin(args.queueName || 'retryQueue', args.options)
    case 'broadcastUpdate':
      return new BroadcastUpdatePlugin(args.options)
    case 'cacheableResponses':
      return new CacheableResponsePlugin(args.options)
    case 'expiration':
      return new ExpirationPlugin(args.options)
    case 'rangeRequests':
      return new RangeRequestsPlugin()
  }
}
