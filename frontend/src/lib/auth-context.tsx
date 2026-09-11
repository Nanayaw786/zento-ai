"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

type AuthState = {
  token: string | null;
  businessId: string | null;
  businessName: string | null;
};

type AuthContextType = AuthState & {
  setAuth: (state: AuthState) => void;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuthState] = useState<AuthState>({
    token: null,
    businessId: null,
    businessName: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("zento_auth");
    if (stored) {
      setAuthState(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const setAuth = (state: AuthState) => {
    setAuthState(state);
    localStorage.setItem("zento_auth", JSON.stringify(state));
  };

  const logout = () => {
    setAuthState({ token: null, businessId: null, businessName: null });
    localStorage.removeItem("zento_auth");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ ...auth, setAuth, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}