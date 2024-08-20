"use client";
import { useAuth } from "@clerk/nextjs";
import { type FormEvent, useTransition } from "react";
import { toast } from "sonner";

import { SubmitButton } from "~/components/SubmitButton";
import { addMovieToSeenList } from "~/server/api/addMovieToSeenList";
import { type EnrichedTMDBMovie } from "~/server/api/getMovie";
import { removeMovieFromSeenList } from "~/server/api/removeMovieFromSeenList";

export function SeenButton(props: { movie: EnrichedTMDBMovie }) {
  const { isSignedIn } = useAuth();
  const [pending, startTransition] = useTransition();

  async function onAddMovieToSeenListSubmit(e: FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      const status = await addMovieToSeenList(props.movie);

      if (status.type === "error") {
        toast.error("Failed to add movie to seen list");
      }
    });
  }

  async function onRemoveMovieFromSeenListSubmit(e: FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      const status = await removeMovieFromSeenList(props.movie);

      if (status.type === "error") {
        toast.error("Failed to remove movie from seen list");
      }
    });
  }

  if (!isSignedIn) {
    return null;
  }

  if (props.movie.seen) {
    return (
      <form onSubmit={onRemoveMovieFromSeenListSubmit}>
        <SubmitButton isLoading={pending} loadingText="Adding">
          Remove From Seen List
        </SubmitButton>
      </form>
    );
  }

  return (
    <form onSubmit={onAddMovieToSeenListSubmit}>
      <SubmitButton isLoading={pending} loadingText="Adding">
        Add To Seen List
      </SubmitButton>
    </form>
  );
}
