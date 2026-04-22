"use client";

import { RankedOpportunity } from "@/lib/types";

interface DeepDiveProps {
  selected: RankedOpportunity | null;
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{label}</span>
        <span className="font-bold text-slate-200">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-[#0A0F1E]">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function DeepDive({ selected }: DeepDiveProps) {
  if (!selected) {
    return (
      <aside className="rounded-2xl border border-violet-500/20 bg-[#141A2E] p-5 text-slate-400">
        Select an opportunity to inspect score evidence and action plan.
      </aside>
    );
  }

  return (
    <aside className="sticky top-6 rounded-2xl border border-violet-500/20 bg-[#141A2E] p-5">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">Deep Dive</p>
      <h3 className="mt-2 text-xl font-bold leading-tight">{selected.title}</h3>
      <p className="mt-1 text-sm text-slate-400">{selected.source}</p>

      <div className="mt-4 rounded-xl border border-violet-500/20 bg-[#0A0F1E] p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Priority Score</p>
        <p className="mt-1 text-4xl font-bold text-violet-300">{selected.score.total}</p>
        <p className="text-xs text-slate-400">Rank #{selected.rank}</p>
      </div>

      <div className="mt-4 space-y-3 rounded-xl border border-violet-500/20 bg-[#0A0F1E] p-4">
        <ScoreBar label="Fit" value={selected.score.fit} color="bg-violet-500" />
        <ScoreBar label="Urgency" value={selected.score.urgency} color="bg-cyan-500" />
        <ScoreBar label="Completeness" value={selected.score.completeness} color="bg-emerald-500" />
        <ScoreBar label="Prestige" value={selected.score.prestige} color="bg-amber-500" />
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-bold text-slate-300">Smart Prerequisite Checklist</h4>
        <ul className="mt-2 space-y-2 text-sm">
          {selected.checklist.map((task) => (
            <li key={task} className="rounded-lg border border-violet-500/20 bg-[#0A0F1E] px-3 py-2 text-slate-200">
              {task}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-bold text-slate-300">Evidence Highlights</h4>
        <div className="mt-2 flex flex-wrap gap-2">
          {selected.score.evidence.map((evidence) => (
            <span key={evidence} className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-xs text-cyan-100">
              {evidence}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
