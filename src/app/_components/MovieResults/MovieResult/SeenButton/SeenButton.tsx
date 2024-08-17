"use client";
import { FormEvent, useState, useTransition } from "react";
import { toast } from "sonner";

import { SubmitButton } from "~/components/SubmitButton";
import { addMovieToSeenList } from "~/server/api/addMovieToSeenList";

export function SeenButton(props: { movie: any }) {
  const [seen, setSeen] = useState(props.movie.seen);
  const [pending, startTransition] = useTransition();

  async function onAddMovieToSeenListSubmit(e: FormEvent) {
    e.preventDefault();

    setSeen(true);

    startTransition(async () => {
      const status = await addMovieToSeenList(props.movie);

      if (status.type === "error") {
        setSeen(false);
        toast.error("Failed to add movie to seen list");
      }
    });
  }

  if (seen) {
    return <span className="px-4">Seen</span>;
  }

  return (
    <form onSubmit={onAddMovieToSeenListSubmit}>
      <SubmitButton isLoading={pending} loadingText="Adding">
        Add To Seen List
      </SubmitButton>
    </form>
  );
}
