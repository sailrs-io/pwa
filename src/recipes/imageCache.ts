import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { ImageCacheOptions } from 'workbox-recipes';

const cacheName = 'images';
const matchCallback = ({ request }: { request: Request }) => request.destination === 'image';
const maxAgeSeconds = 30 * 24 * 60 * 60;
const maxEntries = 60;

export function imageCache(options: ImageCacheOptions = {}) {
  registerRoute(
    matchCallback,
    new StaleWhileRevalidate({
      cacheName: options.cacheName || cacheName,
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new ExpirationPlugin({
          maxEntries: options.maxEntries || maxEntries,
          maxAgeSeconds: options.maxAgeSeconds || maxAgeSeconds,
        }),
      ],
    })
  );
}
