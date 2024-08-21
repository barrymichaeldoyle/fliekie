"use client";
import { useAuth } from "@clerk/nextjs";
import { Eye } from "lucide-react";
import { type FormEvent, useTransition } from "react";
import { toast } from "sonner";

import { SubmitButton } from "~/components/SubmitButton";
import { addMovieToSeenList } from "~/server/api/addMovieToSeenList";
import { type EnrichedTMDBMovie } from "~/server/api/getMovie";
import { removeMovieFromSeenList } from "~/server/api/removeMovieFromSeenList";
import { type TMDBMovie } from "~/server/api/types";

export function SeenButton(props: { movie: EnrichedTMDBMovie }) {
  const { isSignedIn } = useAuth();
  const [pending, startTransition] = useTransition();

  async function onAddMovieToSeenListSubmit(e: FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      const status = await addMovieToSeenList(props.movie as TMDBMovie);

      if (status.type === "error") {
        toast.error("Failed to add movie to seen list");
      }
    });
  }

  async function onRemoveMovieFromSeenListSubmit(e: FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      const status = await removeMovieFromSeenList(props.movie as TMDBMovie);

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
        <SubmitButton isLoading={pending} loadingText="Removing">
          <Eye className="mr-2 h-4 w-4" /> Remove From Seen List
        </SubmitButton>
      </form>
    );
  }

  return (
    <form onSubmit={onAddMovieToSeenListSubmit}>
      <SubmitButton isLoading={pending} loadingText="Adding">
        <Eye className="mr-2 h-4 w-4" /> Add To Seen List
      </SubmitButton>
    </form>
  );
}
