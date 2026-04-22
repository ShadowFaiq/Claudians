"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Zap, ExternalLink } from "lucide-react";

export default function N8nPanel() {
  const [copied, setCopied] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("https://your-domain.vercel.app/api/webhook");

  useEffect(() => {
    setWebhookUrl(`${window.location.origin}/api/webhook`);
  }, []);

  const copy = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass border border-cyan-500/20 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-cyan-500/10">
        <div className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center">
          <Zap size={14} className="text-cyan-400" />
        </div>
        <div>
          <span className="font-semibold text-sm">n8n Automation</span>
          <span className="ml-2 text-xs text-slate-500">Auto-pull from Gmail / Outlook</span>
        </div>
        <a
          href="https://n8n.io"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-xs text-cyan-400 hover:underline flex items-center gap-1"
        >
          n8n.io <ExternalLink size={10} />
        </a>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <p className="text-xs text-slate-400 mb-2">Webhook URL — paste this in your n8n Webhook node</p>
          <div className="flex items-center gap-2 bg-[#0A0F1E] border border-cyan-500/20 rounded-lg px-3 py-2.5">
            <code className="flex-1 text-xs text-cyan-300 truncate">{webhookUrl}</code>
            <button onClick={copy} className="text-slate-500 hover:text-cyan-400 transition-colors flex-shrink-0">
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-400">Setup in 3 steps:</p>
          {[
            "Add a Gmail/Outlook trigger node in n8n",
            "Add a Webhook node → paste the URL above",
            "Map email body to `emails` field, profile fields to `profile`",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs text-slate-400">
              <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              {step}
            </div>
          ))}
        </div>

        <div className="bg-[#0A0F1E] rounded-lg p-3 border border-violet-500/10">
          <p className="text-xs text-slate-500 font-mono">POST {webhookUrl}</p>
          <p className="text-xs text-slate-600 font-mono mt-1">{"{ emails: string, profile: {...} }"}</p>
        </div>
      </div>
    </div>
  );
}
