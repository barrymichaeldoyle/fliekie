import Link from "next/link";

import { getSuggestedUsers } from "~/server/api/getSuggestedUsers";

export async function Suggested() {
  const response = await getSuggestedUsers();

  if (response.type === "error") {
    return <p>Failed to load suggested users</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {response.users.map((user) => (
        <li key={user.id}>
          <Link href={`/u/${user.username}`}>{user.username}</Link>
        </li>
      ))}
    </ul>
  );
}
