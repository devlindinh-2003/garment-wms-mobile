export const convertDateWithTime = (isoString: string): string => {
  if (!isoString || isNaN(new Date(isoString).getTime())) {
    // Return '-' if isoString is empty or invalid
    return '-';
  }

  try {
    const date = new Date(isoString);

    // Extract day, month, and year
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    // Construct the formatted date as dd/mm/yyyy
    const formattedDate = `${day}/${month}/${year}`;

    // Format time as hh:mm (24-hour)
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    return `${formattedTime}, ${formattedDate}`;
  } catch {
    return '-';
  }
};
