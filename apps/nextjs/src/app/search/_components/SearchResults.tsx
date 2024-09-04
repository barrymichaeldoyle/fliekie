"use client";

import { useEffect, useState } from "react";

import type { TMDBMovieSearchResult } from "~/server/api/searchMovies";
import { InfiniteScrollStatus } from "~/components/InfiniteScrollStatus";
import { SearchResult, SearchResultGrid } from "~/components/SearchResult";
import { useInfiniteScroll } from "~/hooks/useInfiniteScroll";
import { searchMovies } from "~/server/api/searchMovies";

export function SearchResults(props: {
  initialMovies: TMDBMovieSearchResult[];
  query: string;
}) {
  const [query, setQuery] = useState(props.query);

  useEffect(() => {
    if (props.query !== query) {
      setQuery(props.query);
    }
  }, [props.query, query]);

  const {
    items: movies,
    isLoading,
    hasMore,
    error,
    observerTarget,
    reset,
  } = useInfiniteScroll({
    initialItems: props.initialMovies,
    fetchFn: (page: number) => searchMovies(query, page),
    dependencies: [query],
  });

  useEffect(() => {
    reset(props.initialMovies);
  }, [query, reset, props.initialMovies]);

  return (
    <div className="flex flex-col gap-4">
      <SearchResultGrid>
        {movies.map((movie, index) => (
          <SearchResult key={movie.id} movie={movie} index={index} />
        ))}
      </SearchResultGrid>
      <InfiniteScrollStatus
        hasMore={hasMore}
        isLoading={isLoading}
        error={error}
        observerRef={observerTarget}
      />
    </div>
  );
}
