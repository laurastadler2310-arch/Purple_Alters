import type { Session, User } from "@supabase/supabase-js";
import * as Linking from 'expo-linking';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "../lib/supabase";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  friendCode: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

function generateFriendCode() {
  return `F-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const handleDeepLink = async (url: string | null) => {
      if (!url) return;

      try {
        const urlObj = new URL(url);
        const code = urlObj.searchParams.get("code");
        const error = urlObj.searchParams.get("error");

        if (error) {
          console.warn("OAuth error from URL:", error);
          return;
        }

        if (code) {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.warn("Failed to exchange code for session:", exchangeError.message);
            return;
          }
          if (data.session && isMounted) {
            setSession(data.session);
            setUser(data.session.user);
          }
        }
      } catch (err) {
        console.warn("Failed to parse deep link:", err);
      }
    };

    const initialize = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (!isMounted) return;
      if (initialUrl) {
        await handleDeepLink(initialUrl);
      }

      const { data, error } = await supabase.auth.getSession();
      if (!isMounted) return;
      if (error) {
        console.warn("Failed to load auth session:", error.message);
      }
      setSession(data.session);
      setUser(data.session?.user ?? null);

      if (data.session?.user) {
        const existingCode = (data.session.user.user_metadata as any)?.friendCode;
        if (!existingCode) {
          const newCode = generateFriendCode();
          const { data: updateData, error: updateError } = await supabase.auth.updateUser({
            data: { friendCode: newCode },
          });

          if (updateError) {
            console.warn("Failed to assign friend code:", updateError.message);
          } else if (updateData.user && isMounted) {
            setUser(updateData.user);
            setSession(prev => prev ? { ...prev, user: updateData.user } : null);
          }
        }
      }

      setLoading(false);
    };

    const subscription = Linking.addEventListener("url", async ({ url }) => {
      await handleDeepLink(url);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    void initialize();

    return () => {
      isMounted = false;
      subscription.remove();
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(error.message);
    } else {
      setSession(null);
      setUser(null);
    }
  };

  const friendCode = ((user?.user_metadata as { friendCode?: string } | null)?.friendCode) ?? null;

  const value = useMemo(
    () => ({ session, user, friendCode, loading, signOut }),
    [session, user, friendCode, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
