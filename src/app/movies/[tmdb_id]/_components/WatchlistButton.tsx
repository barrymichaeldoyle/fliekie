"use client";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { Minus, Plus } from "lucide-react";
import { type FormEvent, useTransition } from "react";
import { toast } from "sonner";

import { SubmitButton } from "~/components/SubmitButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
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
        toast.error("Failed to add movie to watchlist");
      }
    });
  }

  async function onRemoveMovieFromWatchlistSubmit(e: FormEvent) {
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
              <button className="hover:bg-secondary-dark flex items-center justify-center rounded-lg bg-secondary p-2 text-white focus:outline-none">
                <Plus className="h-7 w-7" />
              </button>
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
