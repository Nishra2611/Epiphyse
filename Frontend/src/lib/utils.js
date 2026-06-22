import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatMonthsAsYears(months) {
  const safeMonths = Number.isFinite(Number(months)) ? Math.max(0, Number(months)) : 0;
  const years = Math.floor(safeMonths / 12);
  const remainingMonths = Math.round(safeMonths % 12);

  return {
    years,
    months: remainingMonths,
    decimalYears: (safeMonths / 12).toFixed(1),
  };
}

export function formatFileSize(bytes) {
  if (!bytes) return "0 KB";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const size = bytes / 1024 ** index;
  return `${size.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}
