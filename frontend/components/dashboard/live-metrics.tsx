"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { AlertTriangle, CheckCircle2, Info, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { firebaseAuth } from "@/lib/firebase-client";

type Tone = "success" | "info" | "neutral";

type DashboardMetric = {
  title: string;
  value: string;
  detail: string;
  tone: Tone;
};

type DashboardMetricsResponse = {
  generatedAt: string;
  metrics: DashboardMetric[];
};

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000").replace(/\/+$/, "");

function toneClasses(tone: Tone) {
  if (tone === "success") {
    return "border-emerald-300/30";
  }

  if (tone === "info") {
    return "border-cyan-300/35";
  }

  return "border-black/10";
}

export function LiveMetrics() {
  const [user, setUser] = useState<User | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const loadMetrics = useCallback(async (authUser: User | null) => {
    if (!authUser) {
      setMetrics([]);
      setLastUpdated("");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const idToken = await authUser.getIdToken();
      const response = await fetch(`${apiBaseUrl}/api/dashboard/metrics`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Failed to load metrics (${response.status})`);
      }

      const body = (await response.json()) as DashboardMetricsResponse;
      setMetrics(body.metrics);
      setLastUpdated(body.generatedAt);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : "Failed to load dashboard metrics.";
      setError(message);
      setMetrics([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (nextUser) => {
      setUser(nextUser);
      void loadMetrics(nextUser);
    });

    return unsubscribe;
  }, [loadMetrics]);

  const refreshedLabel = useMemo(() => {
    if (!lastUpdated) {
      return "Never";
    }

    const date = new Date(lastUpdated);
    if (Number.isNaN(date.getTime())) {
      return "Unknown";
    }

    return date.toLocaleString();
  }, [lastUpdated]);

  return (
    <section className="rounded-3xl border border-black/10 bg-white/30 p-5 text-black backdrop-blur-sm md:col-span-2 md:row-span-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-600">Live Dashboard Metrics</p>
          <h3 className="mt-2 text-xl font-semibold">Backend-connected functionalities</h3>
        </div>
        <Button
          onClick={() => void loadMetrics(user)}
          disabled={loading || !user}
          variant="outline"
          className="border-black/15 bg-white/60 text-black hover:bg-white/80"
        >
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <p className="mt-3 text-sm text-slate-700">Last updated: {refreshedLabel}</p>

      {!user ? (
        <p className="mt-4 rounded-2xl border border-amber-300/30 bg-amber-50 p-3 text-sm text-amber-900">
          Sign in to load protected metrics.
        </p>
      ) : null}

      {error ? (
        <p className="mt-4 rounded-2xl border border-red-300/30 bg-red-50 p-3 text-sm text-red-900">{error}</p>
      ) : null}

      {loading ? (
        <p className="mt-4 text-sm text-slate-700">Loading backend metrics...</p>
      ) : null}

      {!loading && metrics.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {metrics.map((metric) => (
            <article
              key={metric.title}
              className={`rounded-2xl border bg-white/45 p-4 backdrop-blur-sm ${toneClasses(metric.tone)}`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-600">{metric.title}</p>
                {metric.tone === "success" ? (
                  <CheckCircle2 className="size-4 text-emerald-600" />
                ) : metric.tone === "info" ? (
                  <Info className="size-4 text-cyan-700" />
                ) : (
                  <AlertTriangle className="size-4 text-slate-700" />
                )}
              </div>
              <p className="mt-2 text-lg font-semibold text-black">{metric.value}</p>
              <p className="mt-1 text-sm text-slate-700">{metric.detail}</p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
