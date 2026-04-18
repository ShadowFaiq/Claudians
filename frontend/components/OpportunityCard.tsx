"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Clock, ExternalLink, CheckSquare, AlertCircle } from "lucide-react";
import type { RankedOpportunity } from "@/lib/types";

interface OpportunityCardProps {
  item: RankedOpportunity;
  style?: React.CSSProperties;
}

const TYPE_COLOR: Record<string, string> = {
  scholarship: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  internship:  "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  fellowship:  "bg-violet-500/20 text-violet-400 border-violet-500/30",
  competition: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  research:    "bg-blue-500/20 text-blue-400 border-blue-500/30",
  admission:   "bg-pink-500/20 text-pink-400 border-pink-500/30",
  course:      "bg-slate-500/20 text-slate-400 border-slate-500/30",
  default:     "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

function urgencyColor(days: number | null) {
  if (days === null) return "text-slate-400";
  if (days <= 3) return "text-red-400";
  if (days <= 7) return "text-amber-400";
  if (days <= 14) return "text-yellow-400";
  return "text-emerald-400";
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-400">{label}</span>
        <span className="text-white font-medium">{value}</span>
      </div>
      <div className="h-1.5 bg-[#0A0F1E] rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function OpportunityCard({ item, style }: OpportunityCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { rank, opportunity: opp, score, actionChecklist, daysUntilDeadline } = item;
  const typeColor = TYPE_COLOR[opp.type] || TYPE_COLOR.default;
  const isTop = rank === 1;

  return (
    <div
      style={style}
      className={`animate-fade-slide-in bg-[#141A2E] rounded-xl border transition-all ${
        isTop ? "border-violet-500/50 shadow-lg shadow-violet-500/10" : "border-violet-500/20 hover:border-violet-500/40"
      }`}
    >
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full text-left p-5"
      >
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold ${
            isTop ? "bg-violet-600 text-white" : "bg-[#0A0F1E] text-slate-400"
          }`}>
            {rank}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-xs px-2 py-0.5 rounded-full border ${typeColor}`}>
                {opp.type}
              </span>
              {isTop && (
                <span className="text-xs bg-violet-600/30 text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded-full">
                  Top Pick
                </span>
              )}
            </div>
            <h3 className="font-semibold text-white text-sm sm:text-base truncate">{opp.title}</h3>
            <p className="text-slate-400 text-xs mt-0.5">{opp.organization}</p>
          </div>

          <div className="flex-shrink-0 text-right">
            <div className={`text-2xl font-bold ${score.total >= 70 ? "text-emerald-400" : score.total >= 50 ? "text-amber-400" : "text-slate-400"}`}>
              {score.total}
            </div>
            <div className="text-xs text-slate-500">score</div>
          </div>

          <div className="flex-shrink-0 self-center">
            {expanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
          </div>
        </div>

        <div className="ml-13 mt-3 flex items-center gap-4 flex-wrap pl-[52px]">
          {daysUntilDeadline !== null && (
            <div className={`flex items-center gap-1 text-xs ${urgencyColor(daysUntilDeadline)}`}>
              <Clock size={12} />
              {daysUntilDeadline <= 0 ? "Expired" : `${daysUntilDeadline}d left`}
              {daysUntilDeadline >= 0 && daysUntilDeadline <= 7 && (
                <AlertCircle size={12} className="ml-0.5" />
              )}
            </div>
          )}
          {opp.deadline && (
            <span className="text-xs text-slate-500">Deadline: {opp.deadline}</span>
          )}
          {opp.location && (
            <span className="text-xs text-slate-500">{opp.location}</span>
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-violet-500/10 px-5 pb-5 pt-4 space-y-5">
          <p className="text-slate-300 text-sm leading-relaxed">{opp.summary}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ScoreBar label="Fit" value={score.fit} color="bg-violet-500" />
            <ScoreBar label="Urgency" value={score.urgency} color="bg-red-500" />
            <ScoreBar label="Completeness" value={score.completeness} color="bg-cyan-500" />
            <ScoreBar label="Prestige" value={score.prestige} color="bg-amber-500" />
          </div>

          {score.evidence.length > 0 && (
            <div>
              <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Evidence</h4>
              <div className="flex flex-wrap gap-2">
                {score.evidence.map((ev, i) => (
                  <span key={i} className="text-xs bg-[#0A0F1E] border border-violet-500/20 text-slate-300 px-2.5 py-1 rounded-full">
                    {ev}
                  </span>
                ))}
              </div>
            </div>
          )}

          {opp.eligibility && (
            <div>
              <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">Eligibility</h4>
              <p className="text-sm text-slate-300">{opp.eligibility}</p>
            </div>
          )}

          {opp.requiredDocs.length > 0 && (
            <div>
              <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">Required Documents</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                {opp.requiredDocs.map((d, i) => <li key={i} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />{d}</li>)}
              </ul>
            </div>
          )}

          {actionChecklist.length > 0 && (
            <div>
              <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Action Checklist</h4>
              <ul className="space-y-1.5">
                {actionChecklist.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckSquare size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    {step.startsWith("http") || step.includes("://") ? (
                      <a href={step.split(": ")[1] || step} target="_blank" rel="noopener noreferrer"
                        className="text-cyan-400 hover:underline flex items-center gap-1">
                        {step} <ExternalLink size={10} />
                      </a>
                    ) : (
                      <span>{step}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {opp.applicationLink && (
            <a href={opp.applicationLink} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              Apply Now <ExternalLink size={14} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
