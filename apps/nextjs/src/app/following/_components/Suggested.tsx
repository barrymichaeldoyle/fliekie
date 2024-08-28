import { type User } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

import { getSuggestedUsers } from "~/server/api/getSuggestedUsers";

import { FollowButton } from "./FollowButton";

export async function Suggested() {
  const response = await getSuggestedUsers();

  if (response.type === "error") {
    return null;
  }

  if (response.users.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Suggested People</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {response.users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </section>
  );
}

function UserCard(props: { user: User }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border p-2 shadow-md">
      <Link href={`/u/${props.user.username}`}>
        <div className="flex items-start gap-4">
          <Image
            src={props.user.imageUrl ?? "/default-avatar.png"}
            alt={props.user.username ?? "User Avatar"}
            width={50}
            height={50}
            className="rounded-full"
          />
          <div className="flex flex-col gap-0.5">
            <p className="text-md font-semibold">{props.user.username}</p>
            <p className="text-sm text-muted-foreground">
              {props.user.fullName}
            </p>
          </div>
        </div>
      </Link>
      <FollowButton
        clerkId={props.user.id}
        className="w-full"
        size="sm"
        variant="secondary"
      />
    </div>
  );
}
