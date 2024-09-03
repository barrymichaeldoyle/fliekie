import { getTrendingMovies } from "~/server/api/getTrendingMovies";

import { TrendingMovies } from "./_components/TrendingMovies";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const initialMoviesResponse = await getTrendingMovies();

  if (initialMoviesResponse.type === "error") {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4">
        <section className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Welcome to Fliekie 🍿</h1>
          <p>A place to review movies and plan your next movie night event!</p>
        </section>
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Trending Movies</h2>
          <p>Error loading movies. Please try again later.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Welcome to Fliekie 🍿</h1>
        <p>A place to review movies and plan your next movie night event!</p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Trending Movies</h2>
        <TrendingMovies initialMovies={initialMoviesResponse.data.results} />
      </section>
    </main>
  );
}
