"use client";
import { useAuth } from "@clerk/nextjs";
import { FormEvent, useOptimistic, useTransition } from "react";
import { toast } from "sonner";

import { SubmitButton } from "~/components/SubmitButton";
import { addMovieToSeenList } from "~/server/api/addMovieToSeenList";
import { EnrichedMovie } from "~/server/api/types";

export function SeenButton(props: { movie: EnrichedMovie }) {
  const { isSignedIn } = useAuth();
  const [optimisticMovie, setOptimisticMovie] = useOptimistic<
    { seen: boolean },
    boolean
  >({ seen: props.movie.seen }, (state, newSeenStatus) => ({
    ...state,
    seen: newSeenStatus,
  }));
  const [pending, startTransition] = useTransition();

  async function onAddMovieToSeenListSubmit(e: FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      setOptimisticMovie(true);
      const status = await addMovieToSeenList(props.movie);

      if (status.type === "error") {
        setOptimisticMovie(false);
        toast.error("Failed to add movie to seen list");
      } else if (status.type === "success") {
        setOptimisticMovie(true);
      }
    });
  }

  if (!isSignedIn) {
    return null;
  }

  if (optimisticMovie.seen) {
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
