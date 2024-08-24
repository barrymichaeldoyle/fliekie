import { Suspense } from "react";

import { Suggested } from "./_components/Suggested";

export const dynamic = "force-dynamic";

export default async function FollowingPage() {
  return (
    <main className="flex flex-1 flex-col gap-8 p-4">
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Following</h1>
        <p>
          This is where we would show you the list of people who you are
          following.
        </p>
        <p>But you are sad and alone and have nobody to follow.</p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Suggested People</h2>
        <Suspense fallback={<p>Loading...</p>}>
          <Suggested />
        </Suspense>
      </section>
    </main>
  );
}
