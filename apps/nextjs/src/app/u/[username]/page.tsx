import { getUserByUsername } from "~/server/api/getUserByUsername";

export default async function UserPage(props: {
  params: { username: string };
}) {
  const response = await getUserByUsername(props.params.username);

  console.log({ response });

  return (
    <main className="flex-1 p-4">
      {response.type === "error" ? (
        <p>Failed to fetch user</p>
      ) : (
        <>
          <h1 className="text-2xl font-bold">{response.user.fullName}</h1>
        </>
      )}
    </main>
  );
}
