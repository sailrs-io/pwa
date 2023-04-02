import { RouteMatchCallback } from "workbox-core/types.js"
import { Route } from "workbox-routing"
import { HTTPMethod } from "workbox-routing/utils/constants.js"
import { NetworkFirstOptions, NetworkOnlyOptions, StrategyOptions } from "workbox-strategies"
import { PluginOptions } from "./plugins.js"

export type Strategy = 'cacheFirst' | 'cacheOnly' | 'networkFirst' | 'networkOnly' | 'staleWhileRevalidate'

type StrategyArgs = Omit<StrategyOptions, 'plugins'>

type CacheFirstArgs = StrategyArgs & PluginOptions & {
  strategy: 'cacheFirst'
}

type CacheOnlyArgs = StrategyArgs & PluginOptions & {
  strategy: 'cacheOnly'
}

type NetworkFirstArgs = NetworkFirstOptions & PluginOptions & {
  strategy: 'networkFirst'
}

type NetworkOnlyArgs = NetworkOnlyOptions & PluginOptions & {
  strategy: 'networkOnly'
}

type StaleWhileRevalidateArgs = StrategyArgs & PluginOptions & {
  strategy: 'staleWhileRevalidate'
}

export type Strategies = CacheFirstArgs | CacheOnlyArgs | NetworkFirstArgs | NetworkOnlyArgs | StaleWhileRevalidateArgs

export type StrategyConfig = Strategies & {
  match: string | RegExp | Route | RouteMatchCallback
  method?: HTTPMethod
}
