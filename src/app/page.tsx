const mockMovies = [
  { title: "Title 1", id: 1 },
  { title: "Title 2", id: 2 },
  { title: "Title 3", id: 3 },
  { title: "Title 4", id: 4 },
  { title: "Title 5", id: 5 },
  { title: "Title 6", id: 6 },
  { title: "Title 7", id: 7 },
  { title: "Title 8", id: 8 },
  { title: "Title 9", id: 9 },
  { title: "Title 10", id: 10 },
];

export default function HomePage() {
  return (
    <main className="">
      <div className="flex flex-wrap gap-4">
        {mockMovies.map((movie) => (
          <div key={movie.id} className="w-48">
            <div className="rounded-lg border border-gray-300 p-4">
              <h2 className="text-lg font-semibold">{movie.title}</h2>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
