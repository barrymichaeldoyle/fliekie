import Image from "next/image";
import Link from "next/link";

import type { Movie } from "~/server/api/types";

export function MovieResult(props: { movie: Movie }) {
  const posterBaseUrl = "https://image.tmdb.org/t/p/w500";

  const formattedDate = props.movie.release_date
    ? new Date(props.movie.release_date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  return (
    <Link
      href={`/movies/${props.movie.tmdb_movie_id}`}
      className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-md transition-transform duration-200 ease-in-out hover:scale-105 hover:bg-muted hover:shadow-lg"
    >
      <div className="flex h-full">
        {props.movie.poster_path ? (
          <Image
            src={`${posterBaseUrl}${props.movie.poster_path}`}
            alt={`${props.movie.title} poster`}
            width={150}
            height={225}
            className="h-auto w-[150px] object-cover"
          />
        ) : (
          <div className="flex h-[225px] w-[150px] items-center justify-center bg-muted">
            <span className="text-muted-foreground">No Image</span>
          </div>
        )}

        <div className="flex flex-1 flex-col justify-between p-4">
          <div>
            <h3 className="text-xl font-semibold">{props.movie.title}</h3>
            <p className="line-clamp-3 text-sm text-muted-foreground">
              {props.movie.overview}
            </p>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Released: {formattedDate}
          </div>
        </div>
      </div>
    </Link>
  );
}
