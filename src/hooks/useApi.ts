import { useCallback, useEffect, useRef, useState } from "react";
interface RegistryItem {
  load: () => void;
  setData: (updater: (oldData: unknown) => unknown) => void;
}
const registry = new Map<string, Set<RegistryItem>>();
const cache = new Map<string, unknown>();
const inFlight = new Map<string, Promise<unknown>>();

export function invalidate(key: string): void {
  registry.get(key)?.forEach((item) => item.load());
}

interface QueryOptions {
  enabled?: boolean;
  deps?: unknown[];
}

interface QueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => Promise<void>;
}

export function useApiQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: QueryOptions,
): QueryResult<T> {
  const enabled = options?.enabled ?? true;
  const depsKey = JSON.stringify(options?.deps ?? []);
  const cacheKey = `${key}::${depsKey}`;

  const [data, setData] = useState<T | undefined>(
    () => cache.get(cacheKey) as T | undefined,
  );
  const [isLoading, setIsLoading] = useState(enabled && !cache.has(cacheKey));
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const inFlightRef = useRef(false);
  const pendingReloadRef = useRef(false);

  const load = useCallback(async () => {
    if (!enabled) return;
    if (inFlightRef.current) {
      pendingReloadRef.current = true;
      return;
    }
    inFlightRef.current = true;
    if (!cache.has(cacheKey)) setIsLoading(true);
    setIsError(false);
    try {
      let promise = inFlight.get(cacheKey);
      if (!promise) {
        promise = fetcherRef.current().finally(() => {
          inFlight.delete(cacheKey);
        });
        inFlight.set(cacheKey, promise);
      }
      const result = (await promise) as T;
      cache.set(cacheKey, result);
      setData(result);
    } catch (e) {
      setIsError(true);
      setError(e);
    } finally {
      setIsLoading(false);
      inFlightRef.current = false;
      if (pendingReloadRef.current) {
        pendingReloadRef.current = false;
        void load();
      }
    }
  }, [enabled, cacheKey]);

  useEffect(() => {
    load();
  }, [cacheKey, load]);

  useEffect(() => {
    let set = registry.get(key);
    if (!set) {
      set = new Set();
      registry.set(key, set);
    }
    const item: RegistryItem = {
      load,
      setData: (updater) => setData((prev) => updater(prev) as T | undefined),
    };
    set.add(item);
    return () => {
      set!.delete(item);
    };
  }, [key, load]);

  return { data, isLoading, isError, error, refetch: load };
}

interface MutationOptions<TData> {
  invalidates?: string[];
  onSuccess?: (data: TData) => void;
  onError?: (error: unknown) => void;
}

interface MutateCallbacks {
  onSuccess?: () => void;
  onError?: () => void;
  onSettled?: () => void;
}

interface MutationResult<TVars, TData> {
  mutate: (vars: TVars, callbacks?: MutateCallbacks) => void;
  mutateAsync: (vars: TVars) => Promise<TData>;
  isPending: boolean;
  error: unknown;
}

export function useApiMutation<TVars, TData = unknown>(
  fn: (vars: TVars) => Promise<TData>,
  options?: MutationOptions<TData>,
): MutationResult<TVars, TData> {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fnRef = useRef(fn);
  fnRef.current = fn;
  const optsRef = useRef(options);
  optsRef.current = options;

  const mutateAsync = useCallback(async (vars: TVars): Promise<TData> => {
    setIsPending(true);
    setError(null);
    try {
      const result = await fnRef.current(vars);
      optsRef.current?.invalidates?.forEach(invalidate);
      optsRef.current?.onSuccess?.(result);
      return result;
    } catch (e) {
      setError(e);
      optsRef.current?.onError?.(e);
      throw e;
    } finally {
      setIsPending(false);
    }
  }, []);

  const mutate = useCallback(
    (vars: TVars, callbacks?: MutateCallbacks) => {
      mutateAsync(vars)
        .then(() => callbacks?.onSuccess?.())
        .catch(() => callbacks?.onError?.())
        .finally(() => callbacks?.onSettled?.());
    },
    [mutateAsync],
  );

  return { mutate, mutateAsync, isPending, error };
}
