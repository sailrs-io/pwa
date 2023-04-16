@sailrs/pwa
===========

`@sailrs/pwa` leverages google's workbox and exposes its API in a more
convenient way. Pretty much like with workbox itself, you can either use
`recipes` or configure your service worker completely as you desire.

## Using Recipes

The easiest way to configure your service worker the following snippet:

```typescript
import { setupServiceWorker } from '@sailrs/pwa'

setupServiceWorker({
  recipes: {
    pageCache: true,
    imageCache: true,
    staticResourcesCache: true,
    offlineFallback: {
      pageFallback: 'my-offline-page',
      imageFallback: '/assets/fallback.jpg',
    },
    warmCache: {
      urls: [
        '/join',
        '/login',
      ],
    }
  },
})
```

Except the google fonts cache, this snippet sets up all recipes from the
workbox documentation. We take it one step further,  because `@sailrs/pwa`
enabled you to compose your caching needs which are enabled here too, where
appropriate. For instance, you cannot change the strategy for `pageCache` but
all the options, that the NetworkFirst Strategy exposes:

```typescript
recipes: {
  pageCache: {
    matchOptions: {
      ignoreSearch: true,
      ignoreVary: true,
    },
    fetchOptions: {
      credentials: 'include',
    },
    networkTimeoutSeconds: 3,
  },
}
```

On the other hand, for the `imageCache` it may make sense to alter the
`matchCallback` or the plugins.

```typescript
imageCache: {
  match: ({ request }) => request.destination === 'image',
  expiration: {
    maxEntries: 100,
    maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
  },
  cacheableResponses: {
    statuses: [0, 200],
  }
},
```

On the `warmCache` you can also change the strategy and plugins.

```typescript
warmCache: {
  strategy: 'staleWhileRevalidate',
  urls: [
    '/join',
    '/login',
  ],
  expiration: {
    maxEntries: 100,
    maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
  },
  cacheableResponses: {
    statuses: [0, 200],
  },
},
```

## Custom Caching Strategies

Use the `caches` section of the configuration to compose the caches as you like.
The key becomes the name of the cache.

```typescript
const config: Config = {
  caches: {
    images: {
      match: /\.(?:png|gif|jpg|jpeg|svg)$/,
      strategy: 'staleWhileRevalidate',
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      },
      ...
    }
  },
}
```

## Handling service worker updates

When a new service worker is released

```typescript
export function promptForUpdate(): Promise<boolean> {
  return new Promise((res) => res(confirm("Update available. Reload now?")));
}
```
