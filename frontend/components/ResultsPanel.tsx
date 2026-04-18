"use client";

import type { AnalyzeResponse } from "@/lib/types";
import OpportunityCard from "./OpportunityCard";
import { Trophy, AlertTriangle } from "lucide-react";

interface ResultsPanelProps {
  data: AnalyzeResponse;
}

function SkeletonCard({ rank }: { rank: number }) {
  return (
    <div className="bg-[#141A2E] border border-violet-500/20 rounded-xl p-5 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-lg bg-slate-700" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-slate-700 rounded w-1/4" />
          <div className="h-4 bg-slate-700 rounded w-3/4" />
          <div className="h-3 bg-slate-700 rounded w-1/3" />
        </div>
        <div className="w-12 h-12 rounded bg-slate-700" />
      </div>
    </div>
  );
}

export function ResultsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map(i => <SkeletonCard key={i} rank={i} />)}
    </div>
  );
}

export default function ResultsPanel({ data }: ResultsPanelProps) {
  const { results, spamCount } = data;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy size={18} className="text-amber-400" />
          <h2 className="font-bold text-lg">Ranked Opportunities</h2>
          <span className="bg-violet-600/20 text-violet-300 text-xs px-2 py-0.5 rounded-full">
            {results.length} found
          </span>
        </div>
        {spamCount > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <AlertTriangle size={12} className="text-amber-500" />
            {spamCount} filtered out
          </div>
        )}
      </div>

      {results.length === 0 ? (
        <div className="bg-[#141A2E] border border-violet-500/20 rounded-xl p-8 text-center">
          <p className="text-slate-400">No real opportunities found in the emails provided.</p>
          <p className="text-slate-500 text-sm mt-1">Try pasting actual opportunity emails or load sample data.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((item, i) => (
            <OpportunityCard
              key={item.opportunity.emailIndex}
              item={item}
              style={{ animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
