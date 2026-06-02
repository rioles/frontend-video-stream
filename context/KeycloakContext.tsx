"use client";

import { createContext, useContext, useEffect, useState } from "react";
import keycloak from "@/lib/keycloak";

interface KeycloakContextType {
  token: string | undefined;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  isLoading: boolean;
}

const KeycloakContext = createContext<KeycloakContextType>({
  token: undefined,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  isLoading: true,
});

export function KeycloakProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    keycloak
      .init({
        onLoad: "check-sso",
        pkceMethod: "S256",
      })
      .then((authenticated) => {
        setIsAuthenticated(authenticated);
        setToken(keycloak.token);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const login = () => keycloak.login({
    redirectUri: process.env.NEXT_PUBLIC_KEYCLOAK_REDIRECT_DASHBOARD
});
  const logout = () => keycloak.logout({ redirectUri: process.env.NEXT_PUBLIC_APP_URL });

  return (
    <KeycloakContext.Provider value={{ token, isAuthenticated, login, logout, isLoading }}>
      {children}
    </KeycloakContext.Provider>
  );
}

export const useKeycloak = () => useContext(KeycloakContext);
