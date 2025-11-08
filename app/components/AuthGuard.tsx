"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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
  const isMountedRef = useRef(false);

  const checkAuth = useCallback(async () => {
    try {
      const currentUser = await account.get();
      if (isMountedRef.current) {
        setUser(currentUser);
        setLoading(false);
      }
    } catch (error) {
      // Logge Authentifizierungsfehler für Debugging
      const errorMessage =
        error instanceof Error ? error.message : "Unbekannter Fehler";
      const errorType =
        error instanceof Error ? error.constructor.name : typeof error;

      console.error("[AuthGuard] Authentifizierung fehlgeschlagen:", {
        type: errorType,
        message: errorMessage,
        timestamp: new Date().toISOString(),
        // Keine sensiblen Daten loggen (kein vollständiges Error-Objekt)
      });

      // User ist nicht eingeloggt
      if (isMountedRef.current) {
        setUser(null);
        setLoading(false);
      }
      // Optional: Weiterleitung zur Login-Seite
      // router.push("/login");
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    checkAuth();

    return () => {
      isMountedRef.current = false;
    };
  }, [checkAuth]);

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
