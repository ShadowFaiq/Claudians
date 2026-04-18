"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { firebaseAuth } from "@/lib/firebase-client";

type ProtectedViewProps = {
  children: React.ReactNode;
};

export function ProtectedView({ children }: ProtectedViewProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-transparent px-6 text-black">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-700">Checking session...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="grid min-h-screen place-items-center bg-transparent px-6 text-black">
        <article className="w-full max-w-xl rounded-3xl border border-black/10 bg-white/30 p-8 text-center text-black backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-600">Access Required</p>
          <h1 className="mt-3 text-3xl font-semibold">Sign in to open functionalities</h1>
          <p className="mt-3 text-sm text-slate-700">
            This page is available after Firebase authentication.
          </p>
          <div className="mt-6 flex justify-center">
            <Button asChild className="bg-cyan-300 text-slate-950 hover:bg-cyan-200">
              <Link href="/auth">Go to login / sign up</Link>
            </Button>
          </div>
        </article>
      </main>
    );
  }

  return <>{children}</>;
}