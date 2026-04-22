"use client";

import { useRef, useState, DragEvent } from "react";
import { Upload, FileText, X, Loader2, AlertCircle } from "lucide-react";

interface FileUploadProps {
  label: string;
  hint: string;
  accept?: string;
  onTextExtracted: (text: string, filename: string) => void;
  compact?: boolean;
}

export default function FileUpload({ label, hint, accept = ".pdf", onTextExtracted, compact }: FileUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file.type.includes("pdf") && !file.name.endsWith(".pdf")) {
      setError("Only PDF files are supported.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File too large — max 10 MB.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/parse-pdf", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Parse failed");
      onTextExtracted(data.text, file.name);
      setUploaded(file.name);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const clear = () => { setUploaded(null); setError(null); if (inputRef.current) inputRef.current.value = ""; };

  if (compact && uploaded) {
    return (
      <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2 text-xs">
        <FileText size={12} className="text-emerald-400" />
        <span className="text-emerald-300 truncate flex-1">{uploaded}</span>
        <button onClick={clear} className="text-slate-500 hover:text-red-400"><X size={12} /></button>
      </div>
    );
  }

  return (
    <div>
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !loading && inputRef.current?.click()}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center text-center
          ${compact ? "py-3 px-4 gap-1" : "py-6 px-4 gap-2"}
          ${dragging ? "border-violet-400 bg-violet-500/10 scale-[1.01]" : "border-violet-500/25 hover:border-violet-500/50 hover:bg-violet-500/5"}
          ${loading ? "pointer-events-none opacity-60" : ""}
        `}
      >
        <input ref={inputRef} type="file" accept={accept} className="hidden"
          onChange={e => e.target.files?.[0] && processFile(e.target.files[0])} />

        {loading ? (
          <Loader2 size={compact ? 16 : 22} className="text-violet-400 animate-spin" />
        ) : uploaded ? (
          <FileText size={compact ? 16 : 22} className="text-emerald-400" />
        ) : (
          <Upload size={compact ? 14 : 20} className="text-slate-500" />
        )}

        <div className={compact ? "text-xs" : "text-sm"}>
          {loading ? (
            <span className="text-violet-300">Extracting text…</span>
          ) : uploaded ? (
            <span className="text-emerald-300 font-medium">{uploaded}</span>
          ) : (
            <>
              <span className="text-slate-300 font-medium">{label}</span>
              <span className="text-slate-600 block text-xs mt-0.5">{hint}</span>
            </>
          )}
        </div>

        {uploaded && (
          <button
            onClick={e => { e.stopPropagation(); clear(); }}
            className="absolute top-2 right-2 text-slate-600 hover:text-red-400 transition-colors"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-400 mt-1.5">
          <AlertCircle size={11} />
          {error}
        </div>
      )}
    </div>
  );
}
