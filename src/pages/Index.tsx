import { useAuth } from "@/hooks/useAuth";
import Auth from "./Auth";
import Dashboard from "./Dashboard";

const Index = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return session ? <Dashboard /> : <Auth />;
};

export default Index;
