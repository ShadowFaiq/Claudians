"use client";

import { Sparkles, Mail, ArrowRight } from "lucide-react";

interface HeroProps {
  onGetStarted: () => void;
}

export default function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative overflow-hidden px-6 py-20 text-center">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-900/20 to-transparent pointer-events-none" />
      <div className="relative max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-violet-600/20 border border-violet-500/30 rounded-full px-4 py-1.5 text-sm text-violet-300 mb-6">
          <Sparkles size={14} />
          <span>SOFTEC&apos;26 AI Hackathon</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold mb-4 leading-tight">
          Stop Ignoring{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
            Opportunities.
          </span>
          <br />
          Start Building Your Future.
        </h1>

        <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
          Paste your opportunity emails. Your AI Copilot extracts deadlines, checks your profile fit,
          and ranks what to act on — first.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onGetStarted}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            <Mail size={18} />
            Analyze My Inbox
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="mt-12 flex justify-center gap-8 text-sm text-slate-500">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">5–15</div>
            <div>emails supported</div>
          </div>
          <div className="w-px bg-slate-700" />
          <div className="text-center">
            <div className="text-2xl font-bold text-white">~5s</div>
            <div>analysis time</div>
          </div>
          <div className="w-px bg-slate-700" />
          <div className="text-center">
            <div className="text-2xl font-bold text-white">100%</div>
            <div>evidence-backed</div>
          </div>
        </div>
      </div>
    </section>
  );
}
