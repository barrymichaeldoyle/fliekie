"use client";

import type { TMDBMovieTrendingResult } from "~/server/api/getTrendingMovies";
import { InfiniteScrollStatus } from "~/components/InfiniteScrollStatus";
import { SearchResult, SearchResultGrid } from "~/components/SearchResult";
import { useInfiniteScroll } from "~/hooks/useInfiniteScroll";
import { getTrendingMovies } from "~/server/api/getTrendingMovies";

export function TrendingMovies(props: {
  initialMovies: TMDBMovieTrendingResult[];
}) {
  const {
    items: movies,
    loading,
    hasMore,
    error,
    observerTarget,
  } = useInfiniteScroll({
    initialItems: props.initialMovies,
    fetchFn: (page: number) => getTrendingMovies("day", page),
  });

  return (
    <div className="flex flex-col gap-4">
      <SearchResultGrid>
        {movies.map((movie, index) => (
          <SearchResult key={movie.id} movie={movie} index={index} />
        ))}
      </SearchResultGrid>
      <InfiniteScrollStatus
        hasMore={hasMore}
        loading={loading}
        error={error}
        observerRef={observerTarget}
      />
    </div>
  );
}
