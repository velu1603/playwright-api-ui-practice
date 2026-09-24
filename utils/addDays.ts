
/**
 * 
 * @param dateString 
 * @param days 
 * @returns date in YYYY-MM-DD
 */

export function addDays(dateString: string, days: number): string {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}