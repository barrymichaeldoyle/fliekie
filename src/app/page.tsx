import { searchMovies } from "~/server/api/searchMovies";

import { MoviesSearchInput } from "./_components/MoviesSearchInput";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const movieResults = await searchMovies(searchParams.search);

  return (
    <main className="p-4">
      <div className="flex flex-wrap gap-4">
        <MoviesSearchInput defaultValue={searchParams.search} />
        <div className="flex w-full flex-col gap-2">
          {movieResults.results.map((movie: any) => (
            <div
              key={movie.id}
              className="bg-card border-border text-card-foreground flex w-full flex-col gap-2 rounded-sm border p-2 shadow-md"
            >
              <div>{movie.title}</div>
              <div className="text-muted-foreground">
                {movie.release_date.substring(0, 4)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
