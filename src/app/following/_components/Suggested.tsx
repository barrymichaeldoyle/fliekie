import { type User } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

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
    <div className="flex flex-col items-center gap-2 rounded-lg border p-4 shadow-md">
      <Image
        src={props.user.imageUrl ?? "/default-avatar.png"}
        alt={props.user.username ?? "User Avatar"}
        width={80}
        height={80}
        className="rounded-full"
      />
      <Link href={`/u/${props.user.username}`}>
        <p className="text-lg font-semibold">{props.user.username}</p>
      </Link>
      <button className="mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
        Follow
      </button>
    </div>
  );
}
