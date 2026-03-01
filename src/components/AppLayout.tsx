import { useState, ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Cloud, Menu, X, LogOut, Shield } from "lucide-react";
import ProjectSidebar from "./ProjectSidebar";
import UserAvatar from "./UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppLayoutProps {
  children: ReactNode;
  selectedProjectId?: string | null;
  onSelectProject?: (id: string | null) => void;
  showProjects?: boolean;
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "rounded-md px-2.5 py-1.5 text-xs sm:text-sm transition-colors duration-150",
    isActive ? "bg-secondary text-brand" : "text-muted-foreground hover-tint",
  );

const AppLayout = ({
  children,
  selectedProjectId = null,
  onSelectProject = () => {},
  showProjects = true,
}: AppLayoutProps) => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-60 flex-shrink-0 flex-col bg-sidebar lg:flex">
        <div className="flex h-14 items-center gap-2 px-5">
          <Cloud className="h-5 w-5 text-brand" />
          <span className="text-base font-semibold tracking-tight">AfuCloud</span>
        </div>

        {showProjects ? (
          <ProjectSidebar selectedProjectId={selectedProjectId} onSelectProject={onSelectProject} />
        ) : (
          <div className="px-5 py-3 text-xs uppercase tracking-wider text-muted-foreground">Account</div>
        )}
      </aside>

      {/* Mobile Drawer */}
      {showProjects && mobileMenuOpen && (
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
        <header className="flex h-14 flex-shrink-0 items-center justify-between gap-2 px-4 lg:px-6">
          <div className="flex items-center gap-2">
            {showProjects && (
              <button onClick={() => setMobileMenuOpen(true)} className="hover-tint rounded-md p-1.5 lg:hidden">
                <Menu className="h-5 w-5" />
              </button>
            )}
            <nav className="flex items-center gap-1">
              <NavLink to="/app" end className={navLinkClass}>Files</NavLink>
              <NavLink to="/app/api" className={navLinkClass}>API</NavLink>
              {isAdmin && (
                <NavLink to="/app/admin" className={navLinkClass}>
                  <span className="flex items-center gap-1">
                    <Shield className="h-3.5 w-3.5" /> Admin
                  </span>
                </NavLink>
              )}
            </nav>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full ring-offset-background transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <UserAvatar />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2">
                <p className="text-sm font-medium truncate">
                  {(user?.user_metadata?.full_name as string) || "User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/app/profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/app/settings")}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-4 pb-6 lg:px-6">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
