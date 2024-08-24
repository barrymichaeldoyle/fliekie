export const dynamic = "force-dynamic";

export default async function FollowersPage() {
  return (
    <main className="flex-1 p-4">
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Followers</h1>
        <p>
          This is where we would show you the list of people who are following
          you.
        </p>
        <p>But you are sad and alone and nobody follows you.</p>
      </section>
    </main>
  );
}
