import { timeParse } from "d3-time-format";

/**
 * Returns whether today's date is between date1 and date2 (inclusive).
 * Dates must be in ISO format: YYYY-MM-DD
 */
export const dateBetween = (date: string, date1: string, date2: string): boolean => {
  const parseDate = timeParse("%Y-%m-%d");

  const d1 = parseDate(date1);
  const d2 = parseDate(date2);
  const d = parseDate(date);

  if (!d1 || !d2 || !d) {
    throw new Error("Invalid date format. Use YYYY-MM-DD.");
  }
  return d >= d1 && d <= d2;
};
