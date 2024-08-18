import Image from "next/image";

import { EnrichedMovie } from "~/server/api/types";

import { SeenButton } from "./SeenButton";

export function MovieResult(props: { movie: EnrichedMovie }) {
  const posterBaseUrl = "https://image.tmdb.org/t/p/w500";

  return (
    <div
      key={props.movie.id}
      className="bg-card border-border text-card-foreground flex w-full items-start rounded-sm border shadow-md"
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
        <div className="bg-muted flex h-[225px] min-h-[225px] w-[150px] min-w-[150px] items-center justify-center rounded-sm">
          <span className="text-muted-foreground">No Image</span>
        </div>
      )}

      <div className="flex h-full flex-col items-start justify-start p-4">
        <div className="flex flex-1 flex-col gap-2">
          <h3 className="text-xl font-semibold">{props.movie.title}</h3>
          <div>{props.movie.overview}</div>
        </div>

        <div className="flex w-full items-center justify-between">
          <div className="text-muted-foreground">
            Released {props.movie.release_date}
          </div>
          <SeenButton movie={props.movie} />
        </div>
      </div>
    </div>
  );
}
