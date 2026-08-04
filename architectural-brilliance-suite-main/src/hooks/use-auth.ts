import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "editor" | "user";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!active) return;
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        // defer to avoid deadlocks
        setTimeout(() => loadRoles(s.user.id), 0);
      } else {
        setRoles([]);
      }
    });

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!active) return;
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) loadRoles(s.user.id).finally(() => setLoading(false));
      else setLoading(false);
    });

    async function loadRoles(uid: string) {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
      if (!active) return;
      setRoles((data ?? []).map((r) => r.role as AppRole));
    }

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    user,
    roles,
    loading,
    isAdmin: roles.includes("admin"),
    isStaff: roles.includes("admin") || roles.includes("editor"),
    signOut: async () => {
      await supabase.auth.signOut();
    },
  };
}
