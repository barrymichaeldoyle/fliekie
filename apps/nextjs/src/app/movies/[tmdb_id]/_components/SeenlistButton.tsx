"use client";
import { useAuth } from "@clerk/nextjs";
import { Eye } from "lucide-react";
import { useTransition } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";

import { SubmitButton } from "~/components/SubmitButton";
import type { EnrichedTMDBMovie } from "~/server/api/getMovie";
import { rateMovie } from "~/server/api/rateMovie";
import { removeMovieRating } from "~/server/api/removeMovieRating";
import type { TMDBMovie } from "~/server/api/types";

export function SeenlistButton(props: { movie: EnrichedTMDBMovie }) {
  const { isSignedIn } = useAuth();
  const [pending, startTransition] = useTransition();

  function onAddMovieToSeenlistSubmit(e: FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      const status = await rateMovie({
        movie: props.movie as TMDBMovie,
        rating: 5,
        review: "",
      });

      if (status.type === "error") {
        toast.error("Failed to add movie to seenlist");
      }
    });
  }

  function onRemoveMovieFromSeenlistSubmit(e: FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      const status = await removeMovieRating(props.movie as TMDBMovie);

      if (status.type === "error") {
        toast.error("Failed to remove movie from seenlist");
      }
    });
  }

  if (!isSignedIn) {
    return null;
  }

  if (props.movie.isRated) {
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
