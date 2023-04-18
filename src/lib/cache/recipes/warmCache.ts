import { warmStrategyCache } from "workbox-recipes";
import { Strategy, StrategyConfig, getStrategy } from "../strategies.js";

export type WarmCacheArgs = Omit<StrategyConfig, "strategy" | "match"> & {
  strategy?: Strategy;
  urls: string[];
};

export function warmCache(config: WarmCacheArgs) {
  const { urls, ...rest } = config;
  const strategy = getStrategy({
    strategy: config.strategy || "cacheFirst",
    cacheName: "warmCache",
    ...rest,
  });
  warmStrategyCache({ urls, strategy });
}
