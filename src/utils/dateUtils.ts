/**
 * Calculates the number of nights between two dates.
 * Returns 0 if dates are invalid or end date is before start date.
 */
export function calculateNumberOfNights(startDate: Date | null, endDate: Date | null): number {
  if (!startDate || !endDate || endDate <= startDate) {
    return 0;
  }
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Formats a Date object or an ISO string into a user-friendly string (e.g., "August 15, 2024").
 */
export function formatDate(date: Date | string): string {
  if (!date) return "N/A";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
}

/**
 * Takes an array of booking objects and returns a flat array of all individual Date objects that are booked.
 */
export function generateBookedDateArray(bookings: { dateFrom: string; dateTo: string }[]): Date[] {
  if (!bookings) return [];
  const dates: Date[] = [];
  bookings.forEach((booking) => {
    const currentDate = new Date(booking.dateFrom);
    const lastDate = new Date(booking.dateTo);
    while (currentDate <= lastDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });
  return dates;
}

/**
 * Checks if a given date range contains any dates from a provided array of disabled dates.
 */
export function isRangeOverlapping(startDate: Date | null, endDate: Date | null, disabledDates: Date[]): boolean {
  if (!startDate || !endDate) {
    return false;
  }
  return disabledDates.some((disabledDate) => disabledDate > startDate && disabledDate < endDate);
}

/**
 * Sorts an array of booking objects by their start date (`dateFrom`).
 * It returns a new, sorted array and does not modify the original.
 *
 * @param {Array<{ dateFrom: string }>} bookings An array of objects that have a `dateFrom` property as an ISO string.
 * @param {'asc' | 'desc'} [direction='asc'] The direction to sort in. 'asc' for oldest to newest, 'desc' for newest to oldest.
 * @returns A new array of booking objects, sorted by date.
 *
 * @example
 * const sorted = sortBookingsByDate(myBookings, 'asc');
 */
export function sortBookingsByDate<T extends { dateFrom: string }>(
  bookings: T[],
  direction: "asc" | "desc" = "asc"
): T[] {
  return [...bookings].sort((a, b) => {
    const dateA = new Date(a.dateFrom).getTime();
    const dateB = new Date(b.dateFrom).getTime();

    if (direction === "asc") {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });
}
