export function formatDate(release_date: string | undefined) {
  return release_date
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(release_date))
    : undefined;
}
