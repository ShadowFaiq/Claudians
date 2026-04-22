"use client";

import { useState } from "react";
import { Mail, Plus, Trash2, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { SAMPLE_EMAILS_ARRAY } from "@/lib/sampleData";
import FileUpload from "./FileUpload";

interface EmailInputProps {
  emails: string[];
  onChange: (emails: string[]) => void;
}

function EmailCard({ index, value, onChange, onRemove }: {
  index: number; value: string; onChange: (v: string) => void; onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const preview = value.trim().split("\n").find(l => l.startsWith("Subject:"))?.replace("Subject:", "").trim()
    || value.trim().split("\n")[0]?.slice(0, 60)
    || `Email ${index + 1}`;

  return (
    <div className="glass border border-violet-500/15 rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-600/40 to-cyan-500/20 flex items-center justify-center text-xs font-bold text-violet-300 flex-shrink-0">
          {index + 1}
        </div>
        <span className="flex-1 text-sm text-slate-300 truncate font-medium">{preview}</span>
        <button onClick={() => setExpanded(e => !e)} className="text-slate-500 hover:text-slate-300 transition-colors p-1">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        <button onClick={onRemove} className="text-slate-600 hover:text-red-400 transition-colors p-1">
          <Trash2 size={13} />
        </button>
      </div>
      {expanded && (
        <div className="px-4 pb-3 border-t border-violet-500/10">
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            rows={6}
            placeholder={`Paste email ${index + 1} content here...\n\nFrom: sender@example.com\nSubject: Opportunity Title\n\nEmail body...`}
            className="w-full bg-[#0A0F1E] rounded-lg px-3 py-2.5 mt-3 text-xs text-slate-300 placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-violet-500/40 resize-none font-mono leading-relaxed border border-transparent focus:border-violet-500/20 transition-colors"
          />
        </div>
      )}
    </div>
  );
}

export default function EmailInput({ emails, onChange }: EmailInputProps) {
  const addEmail = () => onChange([...emails, ""]);
  const removeEmail = (i: number) => onChange(emails.filter((_, idx) => idx !== i));
  const updateEmail = (i: number, v: string) => onChange(emails.map((e, idx) => idx === i ? v : e));
  const loadSamples = () => onChange(SAMPLE_EMAILS_ARRAY);

  return (
    <div className="glass border border-violet-500/20 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-violet-500/10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center">
            <Mail size={14} className="text-cyan-400" />
          </div>
          <div>
            <span className="font-semibold text-sm">Step 1: Your Emails</span>
            <span className="ml-2 text-xs text-slate-500">{emails.length} email{emails.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
        <button
          onClick={loadSamples}
          className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 border border-cyan-500/25 hover:border-cyan-400/50 rounded-lg px-3 py-1.5 transition-all hover:bg-cyan-500/5"
        >
          <RefreshCw size={11} />
          Load 8 Samples
        </button>
      </div>

      <div className="p-4 space-y-3 max-h-[520px] overflow-y-auto">
        {emails.length === 0 && (
          <div className="text-center py-10 text-slate-600">
            <Mail size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No emails added yet</p>
            <p className="text-xs mt-1">Load samples or add emails manually</p>
          </div>
        )}
        {emails.map((email, i) => (
          <EmailCard key={i} index={i} value={email} onChange={v => updateEmail(i, v)} onRemove={() => removeEmail(i)} />
        ))}
      </div>

      <div className="px-4 pb-4 space-y-2">
        <FileUpload
          label="Drop PDF of emails here"
          hint="Drag & drop or click — extracts text from PDF automatically"
          onTextExtracted={(text) => onChange([...emails, text])}
        />
        <button
          onClick={addEmail}
          className="w-full flex items-center justify-center gap-2 border border-dashed border-violet-500/25 hover:border-violet-500/50 text-slate-500 hover:text-violet-400 rounded-xl py-2.5 text-sm transition-all hover:bg-violet-500/5"
        >
          <Plus size={14} />
          Add Email Manually
        </button>
      </div>
    </div>
  );
}
