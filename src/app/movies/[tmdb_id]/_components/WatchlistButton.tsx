"use client";
import { useAuth } from "@clerk/nextjs";
import { MinusCircle, PlusCircle } from "lucide-react";
import { type FormEvent, useTransition } from "react";
import { toast } from "sonner";

import { SubmitButton } from "~/components/SubmitButton";
import { addMovieToWatchlist } from "~/server/api/addMovieToWatchlist";
import { type EnrichedTMDBMovie } from "~/server/api/getMovie";
import { removeMovieFromWatchlist } from "~/server/api/removeMovieFromWatchlist";
import { type TMDBMovie } from "~/server/api/types";

export function WatchlistButton(props: { movie: EnrichedTMDBMovie }) {
  const { isSignedIn } = useAuth();
  const [pending, startTransition] = useTransition();

  async function onAddMovieToWatchlistSubmit(e: FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      const status = await addMovieToWatchlist(props.movie as TMDBMovie);

      if (status.type === "error") {
        toast.error("Failed to add movie to seenlist");
      }
    });
  }

  async function onRemoveMovieFromWatchlistSubmit(e: FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      const status = await removeMovieFromWatchlist(props.movie as TMDBMovie);

      if (status.type === "error") {
        toast.error("Failed to remove movie from seenlist");
      }
    });
  }

  if (!isSignedIn) {
    return null;
  }

  if (props.movie.inWatchlist) {
    return (
      <form onSubmit={onRemoveMovieFromWatchlistSubmit}>
        <SubmitButton variant="ghost" size="icon" isLoading={pending}>
          <MinusCircle className="h-6 w-6" />
        </SubmitButton>
      </form>
    );
  }

  return (
    <form onSubmit={onAddMovieToWatchlistSubmit}>
      <SubmitButton variant="ghost" size="icon" isLoading={pending}>
        <PlusCircle className="h-6 w-6" />
      </SubmitButton>
    </form>
  );
}
