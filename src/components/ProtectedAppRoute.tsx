import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import Auth from "@/pages/Auth";

const ProtectedAppRoute = ({ children }: { children: ReactNode }) => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return <>{children}</>;
};

export default ProtectedAppRoute;
