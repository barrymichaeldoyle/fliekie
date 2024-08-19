export default function Loading() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="spinner" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
