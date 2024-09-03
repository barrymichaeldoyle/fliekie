import { Suspense } from "react";

import { EndOfResults } from "~/components/EndOfResults";

import { TrendingMovies } from "./_components/TrendingMovies";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Welcome to Fliekie 🍿</h1>
        <p>A place to review movies and plan your next movie night event!</p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Trending Movies</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <TrendingMovies />
        </Suspense>
        <EndOfResults />
      </section>
    </main>
  );
}
