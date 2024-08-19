import { Suspense } from "react";

import { MovieResults } from "./_components/MovieResults/MovieResults";
import { MoviesSearchInput } from "./_components/MoviesSearchInput";

export const dynamic = "force-dynamic";

export default async function HomePage(props: {
  searchParams: { search?: string };
}) {
  const query = props.searchParams.search;

  return (
    <main className="flex-1 p-4">
      <div className="flex flex-wrap gap-4">
        <MoviesSearchInput />
        {query && (
          <Suspense fallback={<div>Loading...</div>}>
            <MovieResults query={query} />
          </Suspense>
        )}
      </div>
    </main>
  );
}
