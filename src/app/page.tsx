import { MoviesSearchInput } from "./_components/MoviesSearchInput";
import { MovieResults } from "./_components/MovieResults/MovieResults";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const query = searchParams.search;

  return (
    <main className="p-4">
      <div className="flex flex-wrap gap-4">
        <MoviesSearchInput defaultValue={query} />
        {query && <MovieResults query={query} />}
      </div>
    </main>
  );
}
