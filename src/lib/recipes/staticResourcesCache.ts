import { Route, registerRoute } from 'workbox-routing';
import { RouteMatchCallback } from 'workbox-core/types.js';
import { StrategyConfig } from '../types/strategies.js';
import { getStrategy } from '../strategies.js';

const matchCallback: RouteMatchCallback = ({ request }) =>
  // CSS
  request.destination === 'style' ||
  // JavaScript
  request.destination === 'script' ||
  // Web Workers
  request.destination === 'worker';

const cacheableResponses = {
  statuses: [0, 200]
}

export type StaticResourcesCacheArgs = Omit<StrategyConfig, 'strategy' | 'match'> & {
  match?: string | RegExp | Route | RouteMatchCallback
}

export function staticResourcesCache(config: StaticResourcesCacheArgs) {
  const strategy = getStrategy(
    {
      strategy: 'staleWhileRevalidate',
      cacheName: 'static-resources',
      cacheableResponses: config.cacheableResponses || cacheableResponses,
      ...config
    })
  registerRoute(config.match || matchCallback, strategy);
}
