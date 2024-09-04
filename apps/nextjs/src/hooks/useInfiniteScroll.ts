import { useCallback, useEffect, useRef, useState } from "react";

type FetchFunction<T> = (page: number) => Promise<{
  type: "success" | "error";
  data?: { results: T[] };
  message?: string;
}>;

interface UseInfiniteScrollOptions<T> {
  initialItems: T[];
  fetchFn: FetchFunction<T>;
  dependencies?: React.DependencyList;
}

export function useInfiniteScroll<T extends { id: number }>({
  initialItems,
  fetchFn,
  dependencies = [],
}: UseInfiniteScrollOptions<T>) {
  const observerTarget = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<T[]>(initialItems);
  const [itemIds, setItemIds] = useState(
    new Set<number>(initialItems.map((item) => item.id)),
  );
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback((newInitialItems: T[]) => {
    setItems(newInitialItems);
    setItemIds(new Set<number>(newInitialItems.map((item) => item.id)));
    setPage(1);
    setLoading(false);
    setHasMore(true);
    setError(null);
  }, []);

  const loadMoreItems = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);
    const nextPage = page + 1;
    const response = await fetchFn(nextPage);

    if (response.type === "success" && response.data) {
      const results = response.data.results;
      const newItems = results.filter((item) => !itemIds.has(item.id));
      setItems((prevItems) => [...prevItems, ...newItems]);
      setItemIds((prevIds) => {
        const newIds = new Set(prevIds);
        newItems.forEach((item) => newIds.add(item.id));
        return newIds;
      });
      setPage(nextPage);
      setHasMore(results.length > 0);
    } else {
      setError("Failed to load more items. Please try again.");
      setHasMore(false);
    }
    setLoading(false);
  }, [fetchFn, itemIds, loading, hasMore, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadMoreItems();
        }
      },
      { threshold: 0.1 },
    );

    const currentObserverTarget = observerTarget.current;

    if (currentObserverTarget) {
      observer.observe(currentObserverTarget);
    }

    return () => {
      if (currentObserverTarget) {
        observer.unobserve(currentObserverTarget);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadMoreItems, ...dependencies]);

  return { items, loading, hasMore, error, observerTarget, reset };
}
