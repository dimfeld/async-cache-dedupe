// Write a tsd file for the module
import { expectType } from "tsd";
import { createCache, Cache, createStorage } from ".";
import { StorageInterface, StorageMemoryOptions } from "./index.js";

// Testing internal types

const storageOptions: StorageMemoryOptions = {
  size: 1000,
};

const cache = createCache();
expectType<Cache>(cache);

const storage = createStorage("memory", storageOptions);
expectType<StorageInterface>(storage);

const memoryCache = createCache({
  storage: {
    type: "memory",
    options: storageOptions,
  },
});
expectType<Cache>(memoryCache);

const cacheWithTtlAndStale = createCache({
  ttl: 1000,
  stale: 1000,
});
expectType<Cache>(cacheWithTtlAndStale);

// Testing Union Types

const fetchSomething = async (k: any) => {
  console.log("query", k);
  return { k };
};

export type CachedFunctions = {
  fetchSomething: typeof fetchSomething;
  fetchSomethingElse: typeof fetchSomething;
};

const unionMemoryCache = createCache({
  storage: {
    type: "memory",
    options: storageOptions,
  },
}) as Cache & CachedFunctions;
expectType<Cache & CachedFunctions>(unionMemoryCache);

unionMemoryCache.define("fetchSomething", fetchSomething);
expectType<typeof fetchSomething>(unionMemoryCache.fetchSomething);

unionMemoryCache.define("fetchSomethingElse", { ttl: 1000, stale: 1000}, fetchSomething);
expectType<typeof fetchSomething>(unionMemoryCache.fetchSomethingElse);

const result = await unionMemoryCache.fetchSomething("test");
expectType<{ k: any }>(result);

await unionMemoryCache.invalidateAll("test:*");
await unionMemoryCache.invalidateAll(["test:1", "test:2", "test:3"], "memory");
