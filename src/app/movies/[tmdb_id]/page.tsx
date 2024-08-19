import Image from "next/image";

import { TMDBPrimaryLong } from "~/components/images/TMDBPrimaryLong";
import { getMovie } from "~/server/api/getMovie";
import { SeenButton } from "./_components/SeenButton";

export default async function MoviePage(props: {
  params: { tmdb_id: string };
}) {
  const response = await getMovie(Number(props.params.tmdb_id));

  if (response.type === "error") {
    return <div>Failed to fetch movie</div>;
  }

  if (response.data === null) {
    return <div>Movie not found</div>;
  }

  const backdropPath = response.data.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${response.data.backdrop_path}`
    : null;

  return (
    <main
      className="relative flex-1 bg-cover bg-center bg-no-repeat p-4"
      style={{
        backgroundImage: backdropPath ? `url('${backdropPath}')` : undefined,
      }}
    >
      <div className="absolute inset-0 bg-background opacity-50" />
      <TMDBPrimaryLong className="absolute bottom-4 right-4 w-32 opacity-80" />

      <div className="relative mx-auto max-w-4xl rounded-lg bg-black bg-opacity-70 p-4">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex-shrink-0">
            {response.data.poster_path && (
              <Image
                src={`https://image.tmdb.org/t/p/w500${response.data.poster_path}`}
                alt={response.data.title ?? "Movie Poster"}
                width={300}
                height={450}
                className="rounded-lg"
              />
            )}
          </div>
          <div className="flex flex-1 flex-col justify-start gap-4">
            <div className="flex justify-end">
              <SeenButton movie={response.data} />
            </div>
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
      </div>
    </main>
  );
}
