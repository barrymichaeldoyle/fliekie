"use client";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { Minus, Plus } from "lucide-react";
import { useTransition } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";

import { SubmitButton } from "~/components/SubmitButton";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { addMovieToWatchlist } from "~/server/api/addMovieToWatchlist";
import type { EnrichedTMDBMovie } from "~/server/api/getMovie";
import { removeMovieFromWatchlist } from "~/server/api/removeMovieFromWatchlist";
import type {TMDBMovie} from "~/server/api/types";

export function WatchlistButton(props: { movie: EnrichedTMDBMovie }) {
  const { isSignedIn } = useAuth();
  const [pending, startTransition] = useTransition();

  function onAddMovieToWatchlistSubmit(e: FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      const status = await addMovieToWatchlist(props.movie as TMDBMovie);

      if (status.type === "error") {
        toast.error("Failed to add movie to watchlist");
      }
    });
  }

  function onRemoveMovieFromWatchlistSubmit(e: FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      const status = await removeMovieFromWatchlist(props.movie as TMDBMovie);

      if (status.type === "error") {
        toast.error("Failed to remove movie from watchlist");
      }
    });
  }

  const { inWatchlist } = props.movie;
  const Icon = inWatchlist ? Minus : Plus;

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        {isSignedIn ? (
          <form
            onSubmit={
              inWatchlist
                ? onRemoveMovieFromWatchlistSubmit
                : onAddMovieToWatchlistSubmit
            }
          >
            <TooltipTrigger asChild>
              <SubmitButton variant="secondary" size="icon" isLoading={pending}>
                <Icon className="h-7 w-7" />
              </SubmitButton>
            </TooltipTrigger>
          </form>
        ) : (
          <SignInButton mode="modal">
            <TooltipTrigger asChild>
              <Button variant="secondary" size="icon">
                <Plus className="h-7 w-7" />
              </Button>
            </TooltipTrigger>
          </SignInButton>
        )}
        <TooltipContent side="left">
          <p>{inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
