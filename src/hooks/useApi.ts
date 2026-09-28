import { useCallback, useEffect, useRef, useState } from "react";
import { useAppSelector } from "../store/hooks";

const registry = new Map<string, Set<() => Promise<void>>>();
const inFlight = new Map<string, { key: string; promise: Promise<unknown> }>();
const dataCache = new Map<string, { key: string; data: unknown }>();
const invalidationVersion = new Map<string, number>();
const MAX_CACHED_QUERIES = 50;

export function invalidate(key: string): void {
  invalidationVersion.set(key, (invalidationVersion.get(key) ?? 0) + 1);
  for (const [scope, request] of inFlight) {
    if (request.key === key) inFlight.delete(scope);
  }
  for (const [scope, entry] of dataCache) {
    if (entry.key === key) dataCache.delete(scope);
  }
  registry.get(key)?.forEach((load) => void load());
}

interface QueryOptions {
  enabled?: boolean;
  deps?: unknown[];
}

interface QueryState<T> {
  scope: string;
  data?: T;
  status: "loading" | "success" | "error";
  error?: unknown;
}

export function useApiQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: QueryOptions,
) {
  const enabled = options?.enabled ?? true;
  const token = useAppSelector((state) => state.auth.token);
  const scope = JSON.stringify([token, key, options?.deps ?? []]);
  const [state, setState] = useState<QueryState<T>>(() => {
    const cachedData = dataCache.get(scope)?.data as T | undefined;
    return {
      scope,
      data: cachedData,
      status: enabled && cachedData === undefined ? "loading" : "success",
    };
  });

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const scopeRef = useRef(scope);
  scopeRef.current = scope;
  const requestId = useRef(0);

  const load = useCallback(async () => {
    if (!enabled) return;
    const id = ++requestId.current;
    const version = invalidationVersion.get(key) ?? 0;
    const isCurrent = () =>
      id === requestId.current && scope === scopeRef.current;
    setState((previous) => {
      const data =
        previous.scope === scope
          ? previous.data
          : (dataCache.get(scope)?.data as T | undefined);
      return {
        scope,
        data,
        status: data === undefined ? "loading" : "success",
      };
    });
    try {
      let promise = inFlight.get(scope)?.promise;
      if (!promise) {
        promise = fetcherRef.current().finally(() => {
          if (inFlight.get(scope)?.promise === promise) inFlight.delete(scope);
        });
        inFlight.set(scope, { key, promise });
      }
      const result = (await promise) as T;
      if (version !== (invalidationVersion.get(key) ?? 0)) return;
      dataCache.set(scope, { key, data: result });
      if (dataCache.size > MAX_CACHED_QUERIES) {
        const oldestScope = dataCache.keys().next().value;
        if (oldestScope) dataCache.delete(oldestScope);
      }
      if (isCurrent()) {
        setState({
          scope,
          data: result,
          status: "success",
        });
      }
    } catch (e) {
      if (isCurrent()) {
        setState((previous) => ({
          ...previous,
          status: "error",
          error: e,
        }));
      }
    }
  }, [enabled, key, scope]);

  useEffect(() => {
    const requests = requestId;
    let set = registry.get(key);
    if (!set) {
      set = new Set();
      registry.set(key, set);
    }
    set.add(load);
    void load();
    return () => {
      ++requests.current;
      set.delete(load);
      if (set.size === 0) registry.delete(key);
    };
  }, [key, load]);

  const cachedData = enabled
    ? (dataCache.get(scope)?.data as T | undefined)
    : undefined;
  const visible: QueryState<T> =
    enabled && state.scope === scope
      ? state
      : {
          scope,
          data: cachedData,
          status: enabled && cachedData === undefined ? "loading" : "success",
        };
  return {
    data: visible.data,
    isLoading: visible.status === "loading",
    isError: visible.status === "error",
    error: visible.error ?? null,
    refetch: load,
  };
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

export function useApiMutation<TVars, TData = unknown>(
  fn: (vars: TVars) => Promise<TData>,
  options?: MutationOptions<TData>,
) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const pendingCount = useRef(0);

  const fnRef = useRef(fn);
  fnRef.current = fn;
  const optsRef = useRef(options);
  optsRef.current = options;

  const mutateAsync = useCallback(async (vars: TVars): Promise<TData> => {
    ++pendingCount.current;
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
      setIsPending(--pendingCount.current > 0);
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
