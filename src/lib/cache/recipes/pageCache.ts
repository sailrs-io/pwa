import { Route, registerRoute } from "workbox-routing";
import { RouteMatchCallback } from "workbox-core/types.js";
import { Strategies, getStrategy } from "../strategies.js";

const matchCallback: RouteMatchCallback = ({ request }) =>
  request.mode === "navigate";

export type PageCacheArgs = Omit<Strategies, "strategy" | "match"> & {
  match?: string | RegExp | Route | RouteMatchCallback;
};

const cacheableResponses = {
  statuses: [0, 200],
};

export function pageCache(config: PageCacheArgs) {
  const strategy = getStrategy({
    cacheName: "pages",
    strategy: "networkFirst",
    networkTimeoutSeconds: 3,
    cacheableResponses: config.cacheableResponses || cacheableResponses,
    ...config,
  });
  registerRoute(config.match || matchCallback, strategy);
}
