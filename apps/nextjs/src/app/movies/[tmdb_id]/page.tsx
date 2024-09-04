import Image from "next/image";

import { Badge } from "@fliekie/ui/badge";
import { Button } from "@fliekie/ui/button";

import { TMDBPrimaryLong } from "~/components/images/TMDBPrimaryLong";
import { getMovie } from "~/server/api/getMovie";

import { WatchlistButton } from "./_components/WatchlistButton";

export default async function MoviePage(props: {
  params: { tmdb_id: string };
}) {
  const response = await getMovie(Number(props.params.tmdb_id));

  const backdropPath =
    response.type === "success" && response.data.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${response.data.backdrop_path}`
      : null;

  return (
    <main
      className="relative h-full flex-1 bg-cover bg-center bg-no-repeat p-4"
      style={{
        backgroundImage: backdropPath ? `url('${backdropPath}')` : undefined,
      }}
    >
      {response.type === "error" ? (
        <p>Failed to fetch movie</p>
      ) : (
        <>
          <div className="absolute inset-0 bg-background opacity-50" />
          <TMDBPrimaryLong className="absolute bottom-4 right-4 w-32 opacity-80" />

          <div className="relative mx-auto max-w-4xl rounded-lg border border-border bg-black bg-opacity-70">
            <div className="flex flex-col gap-2 md:flex-row">
              <div className="relative flex-shrink-0">
                {response.data.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${response.data.poster_path}`}
                    alt={response.data.title ?? "Movie Poster"}
                    width={300}
                    height={450}
                    className="rounded-lg"
                  />
                ) : (
                  <div className="flex h-[450px] w-[300px] items-center justify-center rounded-lg bg-muted">
                    <span className="text-muted-foreground">No Image</span>
                  </div>
                )}
                <div className="absolute bottom-2 right-2">
                  <WatchlistButton movieId={response.data.id} inWatchlist />
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-start gap-2 p-4">
                <h1 className="text-4xl font-bold text-white">
                  {response.data.title}
                </h1>
                <div className="flex flex-wrap gap-2">
                  {response.data.genres?.map((genre) => (
                    <Badge key={genre.id}>{genre.name}</Badge>
                  ))}
                </div>
                <p className="text-lg text-gray-300">
                  <span className="font-bold">Released:</span>{" "}
                  {response.data.release_date}
                </p>
                <p>
                  <span className="font-bold">Runtime:</span>{" "}
                  {response.data.runtime}
                </p>
                <p className="text-lg text-gray-300">
                  <span className="font-bold">TMDB Rating:</span>{" "}
                  {response.data.vote_average}/10
                </p>
                <p className="mt-2 text-lg text-gray-300">
                  {response.data.overview}
                </p>
              </div>
            </div>
            <section className="flex flex-col gap-4 p-4">
              <h2 className="text-xl font-semibold text-white">Your Rating</h2>
              <div className="flex items-center gap-2">
                Cool rating component coming soon!
              </div>
              <Button>Write a Review</Button>
            </section>
          </div>
        </>
      )}
    </main>
  );
}
