import { Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-violet-500/10 mt-16 py-8 text-center text-slate-500 text-sm">
      <div className="flex items-center justify-center gap-4">
        <span>Opportunity Inbox Copilot — SOFTEC&apos;26 AI Hackathon</span>
        <span>·</span>
        <span>Built by Muhammad Subhan</span>
        <span>·</span>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-white transition-colors"
        >
          <Github size={14} />
          GitHub
        </a>
      </div>
    </footer>
  );
}
