export function convertDate(isoString: string | null | undefined): string {
  if (!isoString) {
    return 'N/A';
  }

  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    return 'N/A';
  }

  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
