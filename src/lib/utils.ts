import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string | Date | null): string {
  if (!dateString) return "To be announced";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "To be announced";
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return "To be announced";
  }
}

export function formatDateTime(dateString?: string | Date | null): string {
  if (!dateString) return "To be announced";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "To be announced";
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(d);
  } catch {
    return "To be announced";
  }
}

export function formatDateRange(startDate?: string | Date | null, endDate?: string | Date | null): string {
  if (!startDate) return "To be announced";
  const start = formatDate(startDate);
  if (!endDate) return start;
  const end = formatDate(endDate);
  if (start === end) return start;
  return `${start} – ${end}`;
}
