import { cn } from "@/lib/utils";

export function Badge({ className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-semibold text-accent",
        className,
      )}
    >
      {children}
    </span>
  );
}
