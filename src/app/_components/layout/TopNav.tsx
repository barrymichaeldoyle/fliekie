import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function TopNav() {
  return (
    <nav className="flex h-14 w-full items-center justify-between border-b bg-card px-6 text-xl font-semibold">
      <div>Fliekie</div>

      <div className="flex items-center">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
