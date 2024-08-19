import { getMovie } from "~/server/api/getMovie";

export default async function MoviePage(props: {
  params: { tmdb_id: string };
}) {
  const data = await getMovie(Number(props.params.tmdb_id));

  console.log(data);
  return <main className="flex-1 p-4">Movie Page: {props.params.tmdb_id}</main>;
}
