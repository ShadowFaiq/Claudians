"use client";

import { useState, useRef } from "react";
import Hero from "@/components/Hero";
import ProfileForm from "@/components/ProfileForm";
import EmailInput from "@/components/EmailInput";
import ResultsPanel, { ResultsSkeleton } from "@/components/ResultsPanel";
import N8nPanel from "@/components/N8nPanel";
import Footer from "@/components/Footer";
import { DEFAULT_PROFILE } from "@/lib/sampleData";
import type { StudentProfile, AnalyzeResponse } from "@/lib/types";
import { Sparkles, AlertCircle } from "lucide-react";

export default function Home() {
  const [emails, setEmails] = useState<string[]>([]);
  const [profile, setProfile] = useState<StudentProfile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AnalyzeResponse | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  const scrollToInput = () =>
    setTimeout(() => inputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);

  const handleAnalyze = async () => {
    const combined = emails.filter(e => e.trim()).join("\n\n---\n\n");
    if (!combined) {
      setError("Please add at least one email or load sample emails.");
      scrollToInput();
      return;
    }
    setError(null);
    setLoading(true);
    setResults(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: combined, profile }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setResults(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Hero onGetStarted={scrollToInput} />

      <div ref={inputRef} className="max-w-5xl mx-auto px-4 pb-8 space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <EmailInput emails={emails} onChange={setEmails} />
          <div className="space-y-5">
            <ProfileForm profile={profile} onChange={setProfile} />
            <N8nPanel />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/25 text-red-400 rounded-xl px-4 py-3 text-sm">
            <AlertCircle size={16} className="flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="flex justify-center py-2">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="group flex items-center gap-3 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-12 py-4 rounded-2xl text-lg transition-all duration-300 shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 disabled:hover:scale-100"
          >
            <Sparkles size={20} className={loading ? "animate-spin" : "group-hover:rotate-12 transition-transform"} />
            {loading ? "Analyzing..." : "Analyze Inbox"}
          </button>
        </div>

        {loading && <ResultsSkeleton />}
        {results && !loading && <ResultsPanel data={results} />}
      </div>

      <Footer />
    </main>
  );
}
