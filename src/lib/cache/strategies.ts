import {
  CacheFirst,
  CacheOnly,
  NetworkFirst,
  NetworkOnly,
  StaleWhileRevalidate,
} from 'workbox-strategies';
import { getPlugin } from './plugins.js';
import { WorkboxPlugin } from 'workbox-core/types.js';

import { RouteMatchCallback } from 'workbox-core/types.js';
import { Route } from 'workbox-routing';
import { HTTPMethod } from 'workbox-routing/utils/constants.js';
import {
  NetworkFirstOptions,
  NetworkOnlyOptions,
  StrategyOptions,
} from 'workbox-strategies';

import { PluginOptions } from './plugins.js';

export type Strategy =
  | 'cacheFirst'
  | 'cacheOnly'
  | 'networkFirst'
  | 'networkOnly'
  | 'staleWhileRevalidate';

type StrategyArgs = Omit<StrategyOptions, 'plugins'>;

type CacheFirstArgs = StrategyArgs &
  PluginOptions & {
    strategy: 'cacheFirst';
  };

type CacheOnlyArgs = StrategyArgs &
  PluginOptions & {
    strategy: 'cacheOnly';
  };

type NetworkFirstArgs = NetworkFirstOptions &
  PluginOptions & {
    strategy: 'networkFirst';
  };

type NetworkOnlyArgs = NetworkOnlyOptions &
  PluginOptions & {
    strategy: 'networkOnly';
  };

type StaleWhileRevalidateArgs = StrategyArgs &
  PluginOptions & {
    strategy: 'staleWhileRevalidate';
  };

export type Strategies =
  | CacheFirstArgs
  | CacheOnlyArgs
  | NetworkFirstArgs
  | NetworkOnlyArgs
  | StaleWhileRevalidateArgs;

export type StrategyConfig = Strategies & {
  match: string | RegExp | Route | RouteMatchCallback;
  method?: HTTPMethod;
};
// const strategyPlugins = ['backgroundSync', 'broadcastUpdate', 'cacheableResponses', 'expiration', 'rangeRequests'] as const

export function getStrategy(args: Strategies & { cacheName: string }) {
  const plugins: WorkboxPlugin[] = [];

  if (args.expiration) {
    plugins.push(getPlugin({ name: 'expiration', options: args.expiration }));
  }

  if (args.cacheableResponses) {
    plugins.push(
      getPlugin({
        name: 'cacheableResponses',
        options: args.cacheableResponses,
      }),
    );
  }

  if (args.backgroundSync) {
    plugins.push(
      getPlugin({ name: 'backgroundSync', options: args.backgroundSync }),
    );
  }

  if (args.rangeRequests) {
    plugins.push(getPlugin({ name: 'rangeRequests' }));
  }

  if (args.broadcastUpdate) {
    plugins.push(
      getPlugin({ name: 'broadcastUpdate', options: args.broadcastUpdate }),
    );
  }

  switch (args.strategy) {
    case 'cacheFirst':
      return new CacheFirst({ cacheName: args.cacheName, plugins });
    case 'cacheOnly':
      return new CacheOnly({ cacheName: args.cacheName, plugins });
    case 'networkFirst':
      return new NetworkFirst({
        cacheName: args.cacheName,
        plugins,
        networkTimeoutSeconds: args.networkTimeoutSeconds,
      });
    case 'networkOnly':
      return new NetworkOnly({
        plugins,
        networkTimeoutSeconds: args.networkTimeoutSeconds,
      });
    case 'staleWhileRevalidate':
      return new StaleWhileRevalidate({ cacheName: args.cacheName, plugins });
  }
}
