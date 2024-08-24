"use client";

import { SubmitButton } from "~/components/SubmitButton";

export function FollowButton() {
  return (
    <form>
      <SubmitButton size="sm" variant="secondary">
        Follow
      </SubmitButton>
    </form>
  );
}
