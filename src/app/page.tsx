import { MoviesSearchInput } from "./_components/MoviesSearchInput";
import { MovieResults } from "./_components/MovieResults/MovieResults";

export const dynamic = "force-dynamic";

export default async function HomePage(props: {
  searchParams: { search?: string };
}) {
  const query = props.searchParams.search;

  return (
    <main className="flex-1 p-4">
      <div className="flex flex-wrap gap-4">
        <MoviesSearchInput />
        {query && <MovieResults query={query} />}
      </div>
    </main>
  );
}
