import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContext {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContext>({
  session: null,
  user: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const refreshAdminRole = useCallback(async (userId: string | null) => {
    if (!userId) {
      setIsAdmin(false);
      return;
    }

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .limit(1);

    if (error) {
      setIsAdmin(false);
      return;
    }

    setIsAdmin((data?.length ?? 0) > 0);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;

      setSession(nextSession);
      setLoading(false);

      // Avoid async Supabase calls directly inside this callback to prevent deadlocks
      queueMicrotask(() => {
        void refreshAdminRole(nextSession?.user?.id ?? null);
      });
    });

    const failSafeTimeout = window.setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 5000);

    supabase.auth
      .getSession()
      .then(({ data: { session: initialSession } }) => {
        if (!isMounted) return;
        setSession(initialSession);
        setLoading(false);
        void refreshAdminRole(initialSession?.user?.id ?? null);
      })
      .catch(() => {
        if (!isMounted) return;
        setSession(null);
        setIsAdmin(false);
        setLoading(false);
      })
      .finally(() => {
        window.clearTimeout(failSafeTimeout);
      });

    return () => {
      isMounted = false;
      window.clearTimeout(failSafeTimeout);
      subscription.unsubscribe();
    };
  }, [refreshAdminRole]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
