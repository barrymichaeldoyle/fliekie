"use client";
import { useAuth } from "@clerk/nextjs";
import { Eye } from "lucide-react";
import { type FormEvent, useTransition } from "react";
import { toast } from "sonner";

import { SubmitButton } from "~/components/SubmitButton";
import { addMovieToSeenlist } from "~/server/api/addMovieToSeenlist";
import { type EnrichedTMDBMovie } from "~/server/api/getMovie";
import { removeMovieFromSeenlist } from "~/server/api/removeMovieFromSeenlist";
import { type TMDBMovie } from "~/server/api/types";

export function SeenlistButton(props: { movie: EnrichedTMDBMovie }) {
  const { isSignedIn } = useAuth();
  const [pending, startTransition] = useTransition();

  async function onAddMovieToSeenlistSubmit(e: FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      const status = await addMovieToSeenlist(props.movie as TMDBMovie);

      if (status.type === "error") {
        toast.error("Failed to add movie to seenlist");
      }
    });
  }

  async function onRemoveMovieFromSeenlistSubmit(e: FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      const status = await removeMovieFromSeenlist(props.movie as TMDBMovie);

      if (status.type === "error") {
        toast.error("Failed to remove movie from seenlist");
      }
    });
  }

  if (!isSignedIn) {
    return null;
  }

  if (props.movie.inSeenlist) {
    return (
      <form onSubmit={onRemoveMovieFromSeenlistSubmit}>
        <SubmitButton isLoading={pending} loadingText="Removing">
          <Eye className="mr-2 h-4 w-4" /> Remove From Seen List
        </SubmitButton>
      </form>
    );
  }

  return (
    <form onSubmit={onAddMovieToSeenlistSubmit}>
      <SubmitButton isLoading={pending} loadingText="Adding">
        <Eye className="mr-2 h-4 w-4" /> Add To Seen List
      </SubmitButton>
    </form>
  );
}
