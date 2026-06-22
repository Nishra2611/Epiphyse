import { NavLink } from "react-router-dom";
import { navigationItems } from "@/components/layout/navigation";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 border-t border-borderSoft bg-white px-1 py-2 md:hidden">
      {navigationItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-[10px] font-semibold text-textMuted",
                isActive && "bg-teal-50 text-accent",
              )
            }
            aria-label={item.title}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">{item.title}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
