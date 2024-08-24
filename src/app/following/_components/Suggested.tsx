import { type User } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import { getSuggestedUsers } from "~/server/api/getSuggestedUsers";

export async function Suggested() {
  const response = await getSuggestedUsers();

  if (response.type === "error") {
    return <p>Failed to load suggested users</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {response.users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

function UserCard(props: { user: User }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border p-2 shadow-md">
      <Image
        src={props.user.imageUrl ?? "/default-avatar.png"}
        alt={props.user.username ?? "User Avatar"}
        width={60}
        height={60}
        className="rounded-full"
      />
      <div className="flex flex-col gap-2">
        <Link href={`/u/${props.user.username}`}>
          <p className="text-md font-semibold">{props.user.username}</p>
        </Link>
        <Button size="sm" variant="secondary">
          Follow
        </Button>
      </div>
    </div>
  );
}
