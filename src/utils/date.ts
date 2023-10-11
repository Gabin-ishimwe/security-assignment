export default function formatDate(inputDate: string): string {
  const date = new Date(inputDate);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString(undefined, options);
}
