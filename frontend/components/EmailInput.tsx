"use client";

import { Mail, RefreshCw } from "lucide-react";
import { SAMPLE_EMAILS } from "@/lib/sampleData";

interface EmailInputProps {
  value: string;
  onChange: (v: string) => void;
}

export default function EmailInput({ value, onChange }: EmailInputProps) {
  return (
    <div className="bg-[#141A2E] border border-violet-500/20 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-violet-500/10">
        <div className="flex items-center gap-2 font-semibold">
          <Mail size={16} className="text-cyan-400" />
          Step 1: Paste Your Emails
        </div>
        <button
          onClick={() => onChange(SAMPLE_EMAILS)}
          className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 rounded-lg px-3 py-1.5 transition-colors"
        >
          <RefreshCw size={12} />
          Load 8 Sample Emails
        </button>
      </div>
      <div className="p-4">
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={10}
          placeholder={"Paste 5–15 opportunity emails here...\n\nSeparate each email with ---\n\nExample:\nFrom: HEC <scholarships@hec.gov.pk>\nSubject: HEC Scholarship 2026\n\n---\n\nFrom: company@example.com\nSubject: Internship Opening..."}
          className="w-full bg-[#0A0F1E] border border-violet-500/20 rounded-lg px-3 py-2.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-violet-500 resize-none font-mono leading-relaxed"
        />
        <div className="mt-2 text-xs text-slate-500">
          {value ? `${value.split(/\n---+\n/).length} email block(s) detected` : "Separate emails with --- on its own line"}
        </div>
      </div>
    </div>
  );
}
