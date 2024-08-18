import { MoviesSearchInput } from "./_components/MoviesSearchInput";
import { MovieResults } from "./_components/MovieResults/MovieResults";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const query = searchParams.search;

  return (
    <main className="p-4">
      <div className="flex flex-wrap gap-4">
        <MoviesSearchInput />
        {query && <MovieResults query={query} />}
      </div>
    </main>
  );
}
