"use client";

import { useEffect, useState } from "react";
import { account } from "../lib/appwrite";
import { Models } from "appwrite";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
      setLoading(false);
    } catch (error) {
      // User ist nicht eingeloggt
      setUser(null);
      setLoading(false);
      // Optional: Weiterleitung zur Login-Seite
      // router.push("/login");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Lade...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Nicht eingeloggt</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Bitte melde dich an, um fortzufahren.
          </p>
          {/* Hier könnte ein Login-Button oder Link zur Login-Seite eingefügt werden */}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
