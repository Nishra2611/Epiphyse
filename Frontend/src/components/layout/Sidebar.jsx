import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandIcon, navigationItems } from "@/components/layout/navigation";
import { cn } from "@/lib/utils";

function SidebarContent({ compact = false, onNavigate }) {
  return (
    <div className="flex h-full flex-col bg-white">
      <div className={cn("flex h-20 items-center border-b border-borderSoft px-5", compact && "px-4")}>
        <div className="flex min-w-0 items-center gap-3">
          <BrandIcon />
          <div className={cn("min-w-0", compact && "hidden xl:block")}>
            <p className="font-serif text-2xl leading-none text-primary">Epiphyse</p>
            <p className="mt-1 text-xs font-medium text-textMuted">Bone age AI</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-3 py-6">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "group flex min-h-12 items-center gap-3 rounded-lg border-l-4 border-transparent px-3 text-sm font-semibold text-textMuted transition-colors hover:bg-gray-50 hover:text-primary",
                  isActive && "border-accent bg-teal-50 text-accent",
                  compact && "justify-center xl:justify-start",
                )
              }
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className={cn("truncate", compact && "hidden xl:inline")}>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className={cn("border-t border-borderSoft p-4", compact && "px-3")}>
        <div className="rounded-lg border border-teal-100 bg-teal-50 px-3 py-2 text-center">
          <p className="font-mono text-xs font-semibold text-accent">v1.0</p>
          <p className={cn("mt-1 text-xs text-textMuted", compact && "hidden xl:block")}>EfficientNet-B3</p>
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-primary/20 transition-opacity",
          isOpen ? "opacity-100 pointer-events-auto" : "pointer-events-none opacity-0",
        )}
        aria-hidden="true"
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 border-r border-borderSoft bg-white transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Navigation drawer"
      >
        <div className="absolute right-3 top-3">
          <Button variant="ghost" size="icon" type="button" onClick={onClose} aria-label="Close navigation">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <SidebarContent onNavigate={onClose} />
      </aside>
    </>
  );
}
