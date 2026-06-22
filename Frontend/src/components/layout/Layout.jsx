import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { pageTitles } from "@/components/layout/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Epiphyse";

  return (
    <div className="min-h-screen bg-background text-textPrimary">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="min-h-screen pb-20 md:pb-0">
        <Topbar title={title} onMenuClick={() => setIsSidebarOpen(true)} />
        <main>
          <Outlet />
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
