import { Route, registerRoute } from 'workbox-routing';
import { Strategies } from '../../types/strategies.js';
import { RouteMatchCallback } from 'workbox-core/types.js';
import { getStrategy } from '../strategies.js';

const matchCallback: RouteMatchCallback = ({ request }) => request.destination === 'image';
const expiration = {
  maxAgeSeconds: 30 * 24 * 60 * 60,
  maxEntries: 60
}
const cacheableResponses = {
  statuses: [0, 200]
}

export type ImageCacheArgs = Omit<Strategies, 'strategy' | 'match'> & {
  match?: string | RegExp | Route | RouteMatchCallback
}

export function imageCache(config: ImageCacheArgs = {}) {
  const strategy = getStrategy({
    cacheName: 'images',
    strategy: 'staleWhileRevalidate',
    expiration: config.expiration || expiration,
    cacheableResponses: config.cacheableResponses || cacheableResponses,
  })
  registerRoute(config.match || matchCallback,strategy);
}
