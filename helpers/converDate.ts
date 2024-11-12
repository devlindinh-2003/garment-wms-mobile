export function convertDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('vi-VN');
}
