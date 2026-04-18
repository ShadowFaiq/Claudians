"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { ShieldCheck, ShieldX, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { firebaseAuth, googleProvider } from "@/lib/firebase-client";

type BackendAuthResponse = {
  authenticated: boolean;
  uid: string;
  email: string | null;
  name: string | null;
};

type AuthPanelProps = {
  redirectTo?: string;
};

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000").replace(/\/+$/, "");

export function AuthPanel({ redirectTo }: AuthPanelProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");
  const [backendState, setBackendState] = useState<BackendAuthResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (nextUser) => {
      setUser(nextUser);
      setBackendState(null);
      setError("");
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (redirectTo && user) {
      router.replace(redirectTo);
    }
  }, [redirectTo, router, user]);

  const signedInLabel = useMemo(() => {
    if (!user) {
      return "Signed out";
    }

    return user.email ?? "Signed in user";
  }, [user]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError("");
      await signInWithPopup(firebaseAuth, googleProvider);

      if (redirectTo) {
        router.replace(redirectTo);
      }
    } catch (signInError) {
      const message = signInError instanceof Error ? signInError.message : "Sign-in failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      setError("");
      await signOut(firebaseAuth);
    } catch (signOutError) {
      const message = signOutError instanceof Error ? signOutError.message : "Sign-out failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const verifyWithBackend = async () => {
    if (!user) {
      setError("Sign in first to verify with backend.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const idToken = await user.getIdToken();
      const response = await fetch(`${apiBaseUrl}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Backend verification failed (${response.status})`);
      }

      const body = (await response.json()) as BackendAuthResponse;
      setBackendState(body);
    } catch (verifyError) {
      const message = verifyError instanceof Error ? verifyError.message : "Backend verification failed";
      setError(message);
      setBackendState(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="rounded-3xl border border-black/10 bg-white/30 p-5 text-black backdrop-blur-sm md:col-span-2 md:row-span-2">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-600">Firebase Auth</p>
          <h2 className="mt-2 text-xl font-semibold">Frontend + FastAPI verification</h2>
        </div>
        {user ? <ShieldCheck className="size-5 text-emerald-600" /> : <ShieldX className="size-5 text-amber-600" />}
      </div>

      <p className="mt-3 flex items-center gap-2 text-sm text-slate-700">
        <UserRound className="size-4 text-cyan-600" />
        {signedInLabel}
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button onClick={handleGoogleSignIn} disabled={loading || Boolean(user)}>
          Sign in with Google
        </Button>
        <Button
          onClick={verifyWithBackend}
          disabled={loading || !user}
          variant="outline"
          className="border-black/15 bg-white/60 text-black hover:bg-white/80"
        >
          Verify token on backend
        </Button>
        <Button
          onClick={handleSignOut}
          disabled={loading || !user}
          variant="ghost"
          className="text-black hover:bg-black/5"
        >
          Sign out
        </Button>
        {redirectTo && user ? (
          <Button onClick={() => router.replace(redirectTo)} variant="outline" className="border-cyan-300/40 text-black">
            Continue
          </Button>
        ) : null}
      </div>

      {backendState ? (
        <div className="mt-5 rounded-2xl border border-emerald-300/20 bg-emerald-50 p-4 text-sm">
          <p className="font-medium text-emerald-900">Token verified by FastAPI</p>
          <p className="mt-1 text-emerald-800">uid: {backendState.uid}</p>
          <p className="text-emerald-800">email: {backendState.email ?? "-"}</p>
        </div>
      ) : null}

      {error ? (
        <p className="mt-4 rounded-2xl border border-red-300/20 bg-red-50 p-3 text-sm text-red-800">{error}</p>
      ) : null}
    </article>
  );
}
