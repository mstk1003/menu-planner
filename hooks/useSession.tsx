import { Session } from "@supabase/supabase-js";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

type SessionContextValue = {
  session: Session | null;
  isSessionLoading: boolean;
};

const SessionContext = createContext<SessionContextValue | undefined>(
  undefined
);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const isMountedRef = useRef(true);

  useEffect(() => {
    const syncInitialSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (isMountedRef.current) {
        setSession(data.session ?? null);
        setIsSessionLoading(false);
      }
    };

    syncInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (isMountedRef.current) {
        setSession(nextSession);
        setIsSessionLoading(false);
      }
    });

    return () => {
      isMountedRef.current = false;
      subscription.unsubscribe();
    };
  }, []);

  const value: SessionContextValue = {
    session,
    isSessionLoading,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider.");
  }
  return context;
}
