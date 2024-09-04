"use client";

import type { FormEvent } from "react";
import { useTransition } from "react";
import { useAuth } from "@clerk/nextjs";
import { Eye } from "lucide-react";
import { toast } from "sonner";

import { SubmitButton } from "~/components/SubmitButton";
import { rateMovie } from "~/server/api/rateMovie";
import { removeMovieRating } from "~/server/api/removeMovieRating";

export function SeenlistButton(props: { movieId: number; isRated: boolean }) {
  const { isSignedIn } = useAuth();
  const [pending, startTransition] = useTransition();

  function onAddMovieToSeenlistSubmit(e: FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      const status = await rateMovie({
        tmdb_movie_id: props.movieId,
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
      const status = await removeMovieRating(props.movieId);

      if (status.type === "error") {
        toast.error("Failed to remove movie from seenlist");
      }
    });
  }

  if (!isSignedIn) {
    return null;
  }

  if (props.isRated) {
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
