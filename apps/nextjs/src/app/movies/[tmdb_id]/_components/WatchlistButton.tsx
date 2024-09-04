"use client";

import type { FormEvent } from "react";
import { useTransition } from "react";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@fliekie/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@fliekie/ui/tooltip";

import { SubmitButton } from "~/components/SubmitButton";
import { addMovieToWatchlist } from "~/server/api/addMovieToWatchlist";
import { removeMovieFromWatchlist } from "~/server/api/removeMovieFromWatchlist";

export function WatchlistButton(props: {
  inWatchlist: boolean;
  movieId: number;
}) {
  const { isSignedIn } = useAuth();
  const [pending, startTransition] = useTransition();

  function onAddMovieToWatchlistSubmit(e: FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      const status = await addMovieToWatchlist(props.movieId);

      if (status.type === "error") {
        toast.error("Failed to add movie to watchlist");
      }
    });
  }

  function onRemoveMovieFromWatchlistSubmit(e: FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      const status = await removeMovieFromWatchlist(props.movieId);

      if (status.type === "error") {
        toast.error("Failed to remove movie from watchlist");
      }
    });
  }

  const Icon = props.inWatchlist ? Minus : Plus;

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        {isSignedIn ? (
          <form
            onSubmit={
              props.inWatchlist
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
          <p>
            {props.inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
