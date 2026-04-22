import { Github, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-20 py-10">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold text-base">OppoRadar</span>
          <span>—</span>
          <span>AI Opportunity Intelligence</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500">
          Built with <Heart size={12} className="text-violet-400 fill-violet-400" /> by
          <span className="text-white font-medium ml-1">Claudians</span>
        </div>
        <a
          href="https://github.com/ShadowFaiq/Claudians"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group"
        >
          <Github size={15} className="group-hover:text-white" />
          <span>github.com/ShadowFaiq/Claudians</span>
        </a>
      </div>
    </footer>
  );
}
