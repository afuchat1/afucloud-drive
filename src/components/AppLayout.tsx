import { useState, ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Menu, X, LogOut, Shield, User, Settings } from "lucide-react";
import ProjectSidebar from "./ProjectSidebar";
import UserAvatar from "./UserAvatar";
import AfuLogo from "./AfuLogo";
import ThemeSwitcher from "./ThemeSwitcher";
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
    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-primary/10 text-primary"
      : "text-muted-foreground hover:bg-muted hover:text-foreground",
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
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-border bg-card lg:flex">
        <div className="flex h-14 items-center gap-2.5 px-6 border-b border-border">
          <AfuLogo className="h-6 w-6" />
          <span className="text-base font-bold tracking-tight">AfuCloud</span>
        </div>

        {showProjects ? (
          <ProjectSidebar selectedProjectId={selectedProjectId} onSelectProject={onSelectProject} />
        ) : (
          <div className="px-6 py-3 text-xs uppercase tracking-wider text-muted-foreground">Account</div>
        )}
      </aside>

      {/* Mobile Drawer */}
      {showProjects && mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/20" onClick={() => setMobileMenuOpen(false)} />
          <aside className="relative flex h-full w-72 flex-col border-r border-border bg-background">
            <div className="flex h-14 items-center justify-between px-6 border-b border-border">
              <div className="flex items-center gap-2.5">
                <AfuLogo className="h-6 w-6" />
                <span className="text-base font-bold">AfuCloud</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="rounded-md p-1.5 hover:bg-muted transition-colors">
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
        <header className="flex h-14 flex-shrink-0 items-center justify-between gap-2 border-b border-border px-4 lg:px-6">
          <div className="flex items-center gap-3">
            {showProjects && (
              <button onClick={() => setMobileMenuOpen(true)} className="rounded-md p-2 hover:bg-muted transition-colors lg:hidden">
                <Menu className="h-5 w-5" />
              </button>
            )}
            <nav className="flex items-center gap-1">
              <NavLink to="/app" end className={navLinkClass}>Files</NavLink>
              <NavLink to="/app/api" className={navLinkClass}>API</NavLink>
              {isAdmin && (
                <NavLink to="/app/admin" className={navLinkClass}>
                  <span className="flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5" /> Admin
                  </span>
                </NavLink>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full ring-offset-background transition-colors hover:ring-2 hover:ring-primary/20 hover:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <UserAvatar />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-1.5">
                <div className="px-3 py-2.5">
                  <p className="text-sm font-semibold truncate">
                    {(user?.user_metadata?.full_name as string) || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/app/profile")} className="gap-2 py-2">
                  <User className="h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/app/settings")} className="gap-2 py-2">
                  <Settings className="h-4 w-4" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="gap-2 py-2 text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
