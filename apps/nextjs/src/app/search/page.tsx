import { Suspense } from "react";

import { searchMovies } from "~/server/api/searchMovies";

import { SearchResults } from "./_components/SearchResults";

export const dynamic = "force-dynamic";

export default async function SearchPage(props: {
  searchParams: { q?: string };
}) {
  const query = props.searchParams.q ?? "";
  const initialMoviesResponse = await searchMovies(query);

  return (
    <main className="flex-1 p-4">
      <section className="flex flex-col gap-4">
        <h2 className="text-center text-3xl font-bold">
          Search results for &ldquo;{query}&rdquo;
        </h2>

        {initialMoviesResponse.type === "error" ? (
          <div className="text-center text-lg font-semibold text-red-500">
            Error loading movies. Please try again later.
          </div>
        ) : (
          <SearchResults
            initialMovies={initialMoviesResponse.data.results}
            query={query}
          />
        )}
      </section>
    </main>
  );
}
