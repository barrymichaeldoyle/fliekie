import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Suspense } from "react";

import { SearchInput } from "./SearchInput";

export function TopNav() {
  return (
    <nav className="flex min-h-14 w-full items-center justify-between border-b bg-card px-6 font-semibold">
      <div className="text-2xl">🍿 Fliekie</div>

      <div className="flex items-center gap-4 text-lg">
        <Suspense fallback={null}>
          <SearchInput />
        </Suspense>
        <SignedOut>
          <div className="w-20">
            <SignInButton mode="modal" />
          </div>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
