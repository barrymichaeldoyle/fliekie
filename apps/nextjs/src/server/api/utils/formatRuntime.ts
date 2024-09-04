export function formatRuntime(runtime: number) {
  return `${Math.floor(runtime / 60)}h ${runtime % 60}m`;
}
