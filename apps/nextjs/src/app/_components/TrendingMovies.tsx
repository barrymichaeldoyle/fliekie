"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { TMDBMovieTrendingResult } from "~/server/api/getTrendingMovies";
import { EndOfResults } from "~/components/EndOfResults";
import { SearchResult, SearchResultGrid } from "~/components/SearchResult";
import { getTrendingMovies } from "~/server/api/getTrendingMovies";

export function TrendingMovies(props: {
  initialMovies: TMDBMovieTrendingResult[];
}) {
  const observerTarget = useRef<HTMLDivElement>(null);

  const [movies, setMovies] = useState<TMDBMovieTrendingResult[]>(
    props.initialMovies,
  );
  const [movieIds, setMovieIds] = useState(
    new Set<number>(props.initialMovies.map((movie) => movie.id)),
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
    const response = await getTrendingMovies("day", nextPage);

    if (response.type === "success") {
      const results: TMDBMovieTrendingResult[] = response.data.results;
      const newMovies = results.filter((movie) => !movieIds.has(movie.id));
      setMovies((prevMovies) => [...prevMovies, ...newMovies]);
      setMovieIds((prevIds) => {
        const newIds = new Set(prevIds);
        newMovies.forEach((movie) => newIds.add(movie.id));
        return newIds;
      });
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
        {movies.map((movie, index) => (
          <SearchResult key={movie.id} movie={movie} index={index} />
        ))}
      </SearchResultGrid>
      {hasMore && (
        <div
          ref={observerTarget}
          className="flex h-10 items-center justify-center"
        >
          {loading ? (
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary" />
          ) : (
            <div className="h-6 w-6" />
          )}
        </div>
      )}
      {error && <div className="text-red-500">{error}</div>}
      {!hasMore && <EndOfResults />}
    </div>
  );
}
