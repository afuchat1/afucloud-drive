import { useState, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Cloud, Menu, X, LogOut } from "lucide-react";
import ProjectSidebar from "./ProjectSidebar";

interface AppLayoutProps {
  children: ReactNode;
  selectedProjectId: string | null;
  onSelectProject: (id: string | null) => void;
}

const AppLayout = ({ children, selectedProjectId, onSelectProject }: AppLayoutProps) => {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-60 flex-shrink-0 flex-col bg-sidebar lg:flex">
        <div className="flex h-14 items-center gap-2 px-5">
          <Cloud className="h-5 w-5 text-brand" />
          <span className="text-base font-semibold tracking-tight">AfuCloud</span>
        </div>
        <ProjectSidebar
          selectedProjectId={selectedProjectId}
          onSelectProject={onSelectProject}
        />
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/10" onClick={() => setMobileMenuOpen(false)} />
          <aside className="relative flex h-full w-72 flex-col bg-background">
            <div className="flex h-14 items-center justify-between px-5">
              <div className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-brand" />
                <span className="text-base font-semibold">AfuCloud</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="hover-tint rounded-md p-1">
                <X className="h-5 w-5" />
              </button>
            </div>
            <ProjectSidebar
              selectedProjectId={selectedProjectId}
              onSelectProject={(id) => {
                onSelectProject(id);
                setMobileMenuOpen(false);
              }}
            />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-14 flex-shrink-0 items-center justify-between px-4 lg:px-6">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="hover-tint rounded-md p-1.5 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <button
              onClick={signOut}
              className="hover-tint rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-4 pb-6 lg:px-6">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
