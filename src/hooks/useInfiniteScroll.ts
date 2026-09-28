import { useCallback, useEffect, useRef, useState } from "react";
import type { PageResult } from "../types";

export function useScrollSentinel(hasMore: boolean, onReveal: () => void) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onReveal();
      },
      { rootMargin: "300px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, onReveal]);

  return sentinelRef;
}

export function useInfiniteScroll<T>(
  fetchPage: (page: number) => Promise<PageResult<T>>,
  resetDeps: unknown[],
) {
  const [items, setItems] = useState<T[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState<"initial" | "more" | null>("initial");
  const [isError, setIsError] = useState(false);
  const pageRef = useRef(0);
  const generationRef = useRef(0);
  const loadingRef = useRef(false);
  const [exhausted, setExhausted] = useState(false);
  const resetKey = JSON.stringify(resetDeps);
  const fetchRef = useRef(fetchPage);
  fetchRef.current = fetchPage;

  const loadPage = useCallback(async (targetPage: number, replace: boolean) => {
    if (!replace && loadingRef.current) return;
    const generation = replace
      ? ++generationRef.current
      : generationRef.current;
    loadingRef.current = true;
    setLoading(replace ? "initial" : "more");
    setIsError(false);
    try {
      const fetch = fetchRef.current;
      const result: PageResult<T> = { items: [], totalCount: 0 };
      let lastPage = replace ? 0 : targetPage - 1;
      while (lastPage < targetPage) {
        const next = await fetch(++lastPage);
        if (generation !== generationRef.current) return;
        result.items.push(...next.items);
        result.totalCount = next.totalCount;
        if (!next.items.length || result.items.length >= result.totalCount) {
          break;
        }
      }
      setItems((prev) => (replace ? result.items : [...prev, ...result.items]));
      setTotalCount(result.totalCount);
      setExhausted(result.items.length === 0);
      pageRef.current = lastPage;
    } catch {
      if (generation === generationRef.current) setIsError(true);
    } finally {
      if (generation === generationRef.current) {
        loadingRef.current = false;
        setLoading(null);
      }
    }
  }, []);

  useEffect(() => {
    const generations = generationRef;
    pageRef.current = 0;
    setItems([]);
    setTotalCount(0);
    setExhausted(false);
    void loadPage(1, true);
    return () => {
      ++generations.current;
    };
  }, [resetKey, loadPage]);

  const hasMore = !exhausted && items.length < totalCount;

  const loadMore = useCallback(() => {
    if (loading || isError || !hasMore) return;
    void loadPage(pageRef.current + 1, false);
  }, [loading, isError, hasMore, loadPage]);

  const sentinelRef = useScrollSentinel(hasMore, loadMore);

  const refetch = useCallback(
    () => loadPage(pageRef.current || 1, true),
    [loadPage],
  );

  return {
    items,
    totalCount,
    isLoading: loading === "initial",
    isLoadingMore: loading === "more",
    isError,
    hasMore,
    sentinelRef,
    refetch,
  };
}
