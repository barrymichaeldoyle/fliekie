"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { TMDBMovieTrendingResult } from "~/server/api/fetchTrendingMovies";
import { EndOfResults } from "~/components/EndOfResults";
import { SearchResult, SearchResultGrid } from "~/components/SearchResult";
import { fetchTrendingMovies } from "~/server/api/fetchTrendingMovies";

export function TrendingMovies(props: {
  initialMovies: TMDBMovieTrendingResult[];
}) {
  const observerTarget = useRef<HTMLDivElement>(null);

  const [movies, setMovies] = useState<TMDBMovieTrendingResult[]>(
    props.initialMovies,
  );
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMoreMovies = useCallback(async () => {
    if (loading || !hasMore) {
      return undefined;
    }
    setLoading(true);
    setError(null);
    const nextPage = page + 1;
    const response = await fetchTrendingMovies("day", nextPage);

    if (response.type === "success") {
      const results = response.data.results;
      setMovies((prevMovies) => [...prevMovies, ...results]);
      setPage(nextPage);
      setHasMore(results.length > 0);
    } else {
      setError("Failed to load more movies. Please try again.");
      setHasMore(false);
    }
    setLoading(false);
  }, [loading, hasMore, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadMoreMovies();
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
  }, [loadMoreMovies]);

  return (
    <div className="flex flex-col gap-4">
      <SearchResultGrid>
        {movies.map((movie) => (
          <SearchResult key={movie.id} movie={movie} />
        ))}
      </SearchResultGrid>
      {hasMore && (
        <div
          ref={observerTarget}
          className="flex h-10 items-center justify-center"
        >
          {loading ? (
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
          ) : (
            <div className="h-6 w-6"></div>
          )}
        </div>
      )}
      {error && <div className="text-red-500">{error}</div>}
      {!hasMore && <EndOfResults />}
    </div>
  );
}
