import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Topbar({ title, onMenuClick }) {
  return (
    <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between gap-4 border-b border-borderSoft bg-white px-4 md:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={onMenuClick}
          className="inline-flex"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-normal text-textMuted">Epiphyse</p>
          <h1 className="truncate font-serif text-2xl leading-tight text-primary md:text-3xl">{title}</h1>
        </div>
      </div>

      <p className="hidden shrink-0 text-right text-xs font-medium text-textMuted sm:block">
        Model: EfficientNet-B3 | MAE: 8.01 mo | RSNA 12,611 images
      </p>
    </header>
  );
}
