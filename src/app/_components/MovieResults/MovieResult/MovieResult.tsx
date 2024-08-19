import Image from "next/image";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import { type TMDBMovieSearchResult } from "~/server/api/types";

export function MovieResult(props: { movie: TMDBMovieSearchResult }) {
  const posterBaseUrl = "https://image.tmdb.org/t/p/w500";

  return (
    <div
      key={props.movie.id}
      className="flex w-full items-start rounded-sm border border-border bg-card text-card-foreground shadow-md"
    >
      {props.movie.poster_path ? (
        <Image
          src={`${posterBaseUrl}${props.movie.poster_path}`}
          alt={`${props.movie.title} poster`}
          width={150}
          height={225}
          className="h-[225px] min-h-[225px] w-[150px] min-w-[150px] rounded-sm"
        />
      ) : (
        <div className="flex h-[225px] min-h-[225px] w-[150px] min-w-[150px] items-center justify-center rounded-sm bg-muted">
          <span className="text-muted-foreground">No Image</span>
        </div>
      )}

      <div className="flex h-full w-full flex-col items-start justify-start p-4">
        <div className="flex flex-1 flex-col gap-2">
          <h3 className="text-xl font-semibold">{props.movie.title}</h3>
          <div>{props.movie.overview}</div>
        </div>

        <div className="flex w-full items-center justify-between">
          <div className="text-muted-foreground">
            Released {props.movie.release_date}
          </div>

          <Link href={`/movies/${props.movie.id}`}>
            <Button>View Movie</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
