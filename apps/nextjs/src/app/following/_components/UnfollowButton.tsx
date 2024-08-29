"use client";

import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

import type { ButtonProps } from "@fliekie/ui/button";
import { Button } from "@fliekie/ui/button";

import { SubmitButton } from "~/components/SubmitButton";
import { unfollowUser } from "~/server/api/unfollowUser";

export function UnfollowButton({
  clerkId,
  ...buttonProps
}: ButtonProps & { clerkId: string; isFollowing?: boolean }) {
  const [hasUnfollowed, setUnfollowed] = useState(false);
  const { isSignedIn } = useAuth();
  const [pending, startTransition] = useTransition();

  function onFollowSubmit(e: FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      const status = await unfollowUser(clerkId);

      if (status.type === "error") {
        toast.error("Failed to unfollow user");
      } else {
        setUnfollowed(true);
      }
    });
  }

  return (
    <form onSubmit={onFollowSubmit}>
      {isSignedIn ? (
        <SubmitButton
          {...buttonProps}
          loadingText="Unfollowing"
          isLoading={pending}
          disabled={hasUnfollowed}
        >
          {hasUnfollowed ? "Unfollowed" : "Unfollow"}
        </SubmitButton>
      ) : (
        <SignInButton>
          <Button {...buttonProps}>Follow</Button>
        </SignInButton>
      )}
    </form>
  );
}
