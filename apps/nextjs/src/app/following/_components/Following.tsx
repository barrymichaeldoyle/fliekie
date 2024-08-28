import type { User } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

import { getFollowing } from "~/server/api/getFollowing";

import { UnfollowButton } from "./UnfollowButton";

export async function Following() {
  const response = await getFollowing();

  return (
    <section className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Following</h1>
      {response.type === "error" ? (
        <p>Failed to fetch following users.</p>
      ) : response.users.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {response.users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      ) : (
        <>
          <p>
            This is where we would show you the list of people who you are
            following.
          </p>
          <p>But you are sad and alone and have nobody to follow.</p>
        </>
      )}
    </section>
  );
}

function UserCard(props: { user: User }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border p-2 shadow-md">
      <Link href={`/u/${props.user.username}`}>
        <div className="flex items-start gap-4">
          <Image
            src={props.user.imageUrl || "/default-avatar.png"}
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
      <UnfollowButton
        clerkId={props.user.id}
        className="w-full"
        size="sm"
        variant="secondary"
      />
    </div>
  );
}
