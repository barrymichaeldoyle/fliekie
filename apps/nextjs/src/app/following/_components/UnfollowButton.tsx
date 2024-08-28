"use client";

import { SignInButton, useAuth } from "@clerk/nextjs";
import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";

import { SubmitButton } from "~/components/SubmitButton";
import { Button  } from "~/components/ui/button";
import type { ButtonProps } from "~/components/ui/button";
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
