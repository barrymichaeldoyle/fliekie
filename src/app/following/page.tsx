import { Suspense } from "react";

import { Following } from "./_components/Following";
import { Suggested } from "./_components/Suggested";

export const dynamic = "force-dynamic";

export default async function FollowingPage() {
  return (
    <main className="flex flex-1 flex-col gap-8 p-4">
      <Following />

      <Suspense fallback={<p>Loading...</p>}>
        <Suggested />
      </Suspense>
    </main>
  );
}
