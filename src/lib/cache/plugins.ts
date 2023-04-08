import { BackgroundSyncPlugin } from 'workbox-background-sync';
import { BroadcastUpdatePlugin } from 'workbox-broadcast-update';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { RangeRequestsPlugin } from 'workbox-range-requests';

import { QueueOptions } from 'workbox-background-sync';
import { BroadcastCacheUpdateOptions } from 'workbox-broadcast-update';
import { CacheableResponseOptions } from 'workbox-cacheable-response';
import { ExpirationPluginOptions } from 'workbox-expiration';

export type BackgroundSync = {
  name: 'backgroundSync';
  queueName?: string;
  options?: QueueOptions;
};

export type BroadcastUpdate = {
  name: 'broadcastUpdate';
  options?: BroadcastCacheUpdateOptions;
};

export type CacheableResponses = {
  name: 'cacheableResponses';
  options: CacheableResponseOptions;
};

export type Expiration = {
  name: 'expiration';
  options?: ExpirationPluginOptions;
};

export type RangeRequests = {
  name: 'rangeRequests';
};

export type Plugins =
  | BackgroundSync
  | BroadcastUpdate
  | CacheableResponses
  | Expiration
  | RangeRequests;

export type PluginOptions = {
  backgroundSync?: QueueOptions;
  broadcastUpdate?: BroadcastCacheUpdateOptions;
  cacheableResponses?: CacheableResponseOptions;
  expiration?: ExpirationPluginOptions;
  rangeRequests?: boolean;
};

export function getPlugin(args: Plugins) {
  switch (args.name) {
    case 'backgroundSync':
      return new BackgroundSyncPlugin(
        args.queueName || 'retryQueue',
        args.options,
      );
    case 'broadcastUpdate':
      return new BroadcastUpdatePlugin(args.options);
    case 'cacheableResponses':
      return new CacheableResponsePlugin(args.options);
    case 'expiration':
      return new ExpirationPlugin(args.options);
    case 'rangeRequests':
      return new RangeRequestsPlugin();
  }
}
