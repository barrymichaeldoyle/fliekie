import { EnrichedMovie } from "~/server/api/types";

import { SeenButton } from "./SeenButton";

export function MovieResult(props: { movie: EnrichedMovie }) {
  return (
    <div
      key={props.movie.id}
      className="bg-card border-border text-card-foreground flex w-full items-center gap-2 rounded-sm border p-2 shadow-md"
    >
      <div className="flex flex-1 flex-col gap-1">
        <div>{props.movie.title}</div>
        <div className="text-muted-foreground">{props.movie.release_date}</div>
      </div>
      <SeenButton movie={props.movie} />
    </div>
  );
}
