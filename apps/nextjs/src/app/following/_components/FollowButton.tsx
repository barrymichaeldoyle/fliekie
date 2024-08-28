"use client";

import { SignInButton, useAuth } from "@clerk/nextjs";
import { useState, useTransition } from "react";
import type {FormEvent} from "react";
import { toast } from "sonner";

import { SubmitButton } from "~/components/SubmitButton";
import { Button  } from "~/components/ui/button";
import type { ButtonProps } from "~/components/ui/button";
import { followUser } from "~/server/api/followUser";

export function FollowButton({
  clerkId,
  ...buttonProps
}: ButtonProps & { clerkId: string; isFollowing?: boolean }) {
  const [isFollowing, setFollowing] = useState(false);
  const { isSignedIn } = useAuth();
  const [pending, startTransition] = useTransition();

  function onFollowSubmit(e: FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      const status = await followUser(clerkId);

      if (status.type === "error") {
        toast.error(`Failed to follow user`);
      } else {
        setFollowing(true);
      }
    });
  }

  return (
    <form onSubmit={onFollowSubmit}>
      {isSignedIn ? (
        <SubmitButton
          {...buttonProps}
          loadingText="Following"
          isLoading={pending}
          disabled={isFollowing}
        >
          {isFollowing ? "Following" : "Follow"}
        </SubmitButton>
      ) : (
        <SignInButton>
          <Button {...buttonProps}>Follow</Button>
        </SignInButton>
      )}
    </form>
  );
}
