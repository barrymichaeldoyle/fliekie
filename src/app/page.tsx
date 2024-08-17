import { searchMovies } from "~/server/api/searchMovies";

import { MoviesSearchInput } from "./_components/MoviesSearchInput";

export default async function HomePage({
  searchParams,
}: {
  searchParams: {
    search?: string;
  };
}) {
  const movieResults = await searchMovies(searchParams.search);

  return (
    <main className="p-4">
      <div className="flex flex-wrap gap-4">
        <MoviesSearchInput defaultValue={searchParams.search} />
        <div>
          {movieResults.results.map((movie: any) => (
            <div key={movie.id}>
              {movie.title} ({movie.release_date.substring(0, 4)})
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
