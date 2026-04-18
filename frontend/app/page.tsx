"use client";

import { useState, useRef } from "react";
import Hero from "@/components/Hero";
import ProfileForm from "@/components/ProfileForm";
import EmailInput from "@/components/EmailInput";
import ResultsPanel, { ResultsSkeleton } from "@/components/ResultsPanel";
import Footer from "@/components/Footer";
import { DEFAULT_PROFILE } from "@/lib/sampleData";
import type { StudentProfile, AnalyzeResponse } from "@/lib/types";
import { Sparkles, AlertCircle } from "lucide-react";

export default function Home() {
  const [emails, setEmails] = useState("");
  const [profile, setProfile] = useState<StudentProfile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AnalyzeResponse | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  const scrollToInput = () => {
    setTimeout(() => inputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const handleAnalyze = async () => {
    if (!emails.trim()) {
      setError("Please paste some emails first.");
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
        body: JSON.stringify({ emails, profile }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const data: AnalyzeResponse = await res.json();
      setResults(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Hero onGetStarted={() => { scrollToInput(); }} />

      <div ref={inputRef} className="max-w-5xl mx-auto px-4 pb-8 space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <EmailInput value={emails} onChange={setEmails} />
          <ProfileForm profile={profile} onChange={setProfile} />
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="flex items-center gap-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors animate-pulse-ring"
          >
            <Sparkles size={20} />
            {loading ? "Analyzing..." : "Analyze Inbox"}
          </button>
        </div>

        {loading && <ResultsSkeleton />}

        {results && !loading && (
          <div className="mt-2">
            <ResultsPanel data={results} />
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
