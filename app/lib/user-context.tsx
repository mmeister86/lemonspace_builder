"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { account } from "./appwrite";
import { Models } from "appwrite";

interface UserContextType {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  error: Error | null;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  error: null,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;

    async function fetchUser() {
      try {
        const currentUser = await account.get();
        if (isMountedRef.current) {
          setUser(currentUser);
          setLoading(false);
          setError(null);
        }
      } catch (err) {
        if (isMountedRef.current) {
          setUser(null);
          setLoading(false);
          setError(
            err instanceof Error ? err : new Error("Failed to fetch user")
          );
        }
      }
    }

    fetchUser();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
