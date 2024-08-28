import Image from "next/image";

import { TMDBPrimaryLong } from "~/components/images/TMDBPrimaryLong";
import { Button } from "~/components/ui/button";
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
          <div className="bg-background absolute inset-0 opacity-50" />
          <TMDBPrimaryLong className="absolute bottom-4 right-4 w-32 opacity-80" />

          <div className="border-border relative mx-auto max-w-4xl rounded-lg border bg-black bg-opacity-70">
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
                  <div className="bg-muted flex h-[450px] w-[300px] items-center justify-center rounded-lg">
                    <span className="text-muted-foreground">No Image</span>
                  </div>
                )}
                <div className="absolute bottom-2 right-2">
                  <WatchlistButton movie={response.data} />
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-start gap-4 p-4">
                <h1 className="text-4xl font-bold text-white">
                  {response.data.title}
                </h1>
                <p className="text-lg text-gray-300">
                  Release Date: {response.data.release_date}
                </p>
                <p className="text-lg text-gray-300">
                  TMDB Rating: {response.data.vote_average}/10
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
