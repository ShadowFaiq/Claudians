"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, User } from "lucide-react";
import type { StudentProfile, OpportunityType } from "@/lib/types";

interface ProfileFormProps {
  profile: StudentProfile;
  onChange: (p: StudentProfile) => void;
}

const OPP_TYPES: OpportunityType[] = ["scholarship", "internship", "fellowship", "competition", "research", "admission"];

export default function ProfileForm({ profile, onChange }: ProfileFormProps) {
  const [open, setOpen] = useState(true);

  const set = <K extends keyof StudentProfile>(key: K, val: StudentProfile[K]) =>
    onChange({ ...profile, [key]: val });

  const toggleType = (t: OpportunityType) => {
    const cur = profile.preferredTypes;
    set("preferredTypes", cur.includes(t) ? cur.filter(x => x !== t) : [...cur, t]);
  };

  const inputCls = "w-full bg-[#0A0F1E] border border-violet-500/20 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500";

  return (
    <div className="bg-[#141A2E] border border-violet-500/20 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-violet-500/5 transition-colors"
      >
        <div className="flex items-center gap-2 font-semibold">
          <User size={16} className="text-violet-400" />
          Step 2: Your Profile
        </div>
        {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>

      {open && (
        <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Full Name</label>
            <input className={inputCls} value={profile.name} onChange={e => set("name", e.target.value)} placeholder="Ali Hassan" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Degree / Program</label>
            <input className={inputCls} value={profile.degree} onChange={e => set("degree", e.target.value)} placeholder="Computer Science" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Semester</label>
            <input className={inputCls} type="number" min={1} max={12} value={profile.semester}
              onChange={e => set("semester", parseInt(e.target.value) || 1)} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">CGPA</label>
            <input className={inputCls} type="number" step="0.01" min={0} max={4} value={profile.cgpa}
              onChange={e => set("cgpa", parseFloat(e.target.value) || 0)} placeholder="3.2" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-400 mb-1 block">Skills (comma-separated)</label>
            <input className={inputCls} value={profile.skills.join(", ")}
              onChange={e => set("skills", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
              placeholder="Python, React, Machine Learning" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Location</label>
            <input className={inputCls} value={profile.location} onChange={e => set("location", e.target.value)} placeholder="Lahore" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Experience</label>
            <input className={inputCls} value={profile.experience} onChange={e => set("experience", e.target.value)} placeholder="1 year freelance..." />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-400 mb-2 block">Preferred Opportunity Types</label>
            <div className="flex flex-wrap gap-2">
              {OPP_TYPES.map(t => (
                <button key={t} onClick={() => toggleType(t)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    profile.preferredTypes.includes(t)
                      ? "bg-violet-600 text-white"
                      : "bg-[#0A0F1E] border border-violet-500/20 text-slate-400 hover:border-violet-500/50"
                  }`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="sm:col-span-2 flex items-center gap-3">
            <button onClick={() => set("financialNeed", !profile.financialNeed)}
              className={`w-10 h-5 rounded-full relative transition-colors ${profile.financialNeed ? "bg-violet-600" : "bg-slate-700"}`}>
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${profile.financialNeed ? "translate-x-5" : ""}`} />
            </button>
            <label className="text-sm text-slate-300">Financial need (boosts funded opportunities)</label>
          </div>
        </div>
      )}
    </div>
  );
}
