"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { AlertCircle, CheckCircle2, ListChecks, Sparkles, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { firebaseAuth } from "@/lib/firebase-client";

type ProfileState = {
  degreeProgram: string;
  semester: number;
  cgpa: number;
  skills: string;
  interests: string;
  preferredOpportunityTypes: string[];
  financialNeed: string;
  locationPreference: string;
  pastExperience: string;
};

type RankedOpportunity = {
  source_email_index: number;
  opportunity_type: string;
  title: string;
  organization: string;
  deadline_iso: string | null;
  priority_score: number;
  fit_score: number;
  urgency_score: number;
  completeness_score: number;
  why_it_matches: string[];
  action_checklist: string[];
  evidence: string[];
  links: string[];
  contact_info: string[];
  required_documents: string[];
};

type RejectedItem = {
  source_email_index: number;
  title: string;
  spam_reason: string | null;
  evidence: string[];
};

type AnalysisResponse = {
  generated_at: string;
  ranked_opportunities: RankedOpportunity[];
  rejected_items: RejectedItem[];
};

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000").replace(/\/+$/, "");

const defaultProfile: ProfileState = {
  degreeProgram: "BS Computer Science",
  semester: 4,
  cgpa: 3.2,
  skills: "python, machine learning, data analysis",
  interests: "ai, cloud, backend",
  preferredOpportunityTypes: ["internship", "scholarship"],
  financialNeed: "medium",
  locationPreference: "remote",
  pastExperience: "hackathon projects, semester project",
};

const typeOptions = ["scholarship", "internship", "fellowship", "job", "competition", "conference"];

export function OpportunityInboxCopilot() {
  const [profile, setProfile] = useState<ProfileState>(defaultProfile);
  const [emailsInput, setEmailsInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [user, setUser] = useState<User | null>(firebaseAuth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (nextUser) => {
      setUser(nextUser);
    });

    return unsubscribe;
  }, []);

  const parsedEmails = useMemo(() => {
    return emailsInput
      .split(/\n\s*---\s*\n/g)
      .map((chunk) => chunk.trim())
      .filter(Boolean);
  }, [emailsInput]);

  const toggleType = (value: string) => {
    setProfile((prev) => {
      const exists = prev.preferredOpportunityTypes.includes(value);
      if (exists) {
        return {
          ...prev,
          preferredOpportunityTypes: prev.preferredOpportunityTypes.filter((item) => item !== value),
        };
      }

      return {
        ...prev,
        preferredOpportunityTypes: [...prev.preferredOpportunityTypes, value],
      };
    });
  };

  const onFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const text = await file.text();
    setEmailsInput((prev) => {
      if (!prev.trim()) {
        return text.trim();
      }

      return `${prev.trim()}\n\n---\n\n${text.trim()}`;
    });
  };

  const submitForAnalysis = async () => {
    if (!user) {
      setError("Sign in first to run opportunity analysis.");
      return;
    }

    if (profile.degreeProgram.trim().length < 2) {
      setError("Please enter a valid Degree/Program (at least 2 characters).");
      return;
    }

    if (parsedEmails.length < 5 || parsedEmails.length > 15) {
      setError("Please provide between 5 and 15 emails. Use --- on a new line to separate emails.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const idToken = await user.getIdToken();
      const response = await fetch(`${apiBaseUrl}/api/opportunity-inbox/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          profile: {
            degree_program: profile.degreeProgram,
            semester: profile.semester,
            cgpa: profile.cgpa,
            skills: profile.skills.split(",").map((s) => s.trim()).filter(Boolean),
            interests: profile.interests.split(",").map((s) => s.trim()).filter(Boolean),
            preferred_opportunity_types: profile.preferredOpportunityTypes,
            financial_need: profile.financialNeed,
            location_preference: profile.locationPreference,
            past_experience: profile.pastExperience.split(",").map((s) => s.trim()).filter(Boolean),
          },
          emails: parsedEmails,
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Analysis failed (${response.status})`);
      }

      const body = (await response.json()) as AnalysisResponse;
      setResult(body);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Analysis failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-3xl border border-black/10 bg-white/30 p-5 text-black backdrop-blur-sm md:col-span-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-600">Opportunity Inbox Copilot</p>
          <h2 className="mt-2 text-2xl font-semibold">AI Parsing + Deterministic Ranking</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-700">
            Submit a structured profile and 5-15 emails. The backend classifies genuine opportunities,
            extracts fields, and returns ranked results with evidence and action checklists.
          </p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white/60 px-3 py-2 text-sm text-slate-700">
          Emails loaded: {parsedEmails.length}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-black/10 bg-white/45 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-700">Student Profile</h3>
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            <label className="text-sm text-slate-800">
              Degree/Program
              <input
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2"
                value={profile.degreeProgram}
                onChange={(event) => setProfile((prev) => ({ ...prev, degreeProgram: event.target.value }))}
                placeholder="BS Computer Science"
              />
            </label>
            <label className="text-sm text-slate-800">
              Semester
              <input
                type="number"
                min={1}
                max={20}
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2"
                value={profile.semester}
                onChange={(event) => setProfile((prev) => ({ ...prev, semester: Number(event.target.value) || 1 }))}
              />
            </label>
            <label className="text-sm text-slate-800">
              CGPA
              <input
                type="number"
                min={0}
                max={4}
                step="0.01"
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2"
                value={profile.cgpa}
                onChange={(event) => setProfile((prev) => ({ ...prev, cgpa: Number(event.target.value) || 0 }))}
              />
            </label>
            <label className="text-sm text-slate-800">
              Financial Need
              <select
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2"
                value={profile.financialNeed}
                onChange={(event) => setProfile((prev) => ({ ...prev, financialNeed: event.target.value }))}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
            <label className="text-sm text-slate-800 md:col-span-2">
              Skills (comma separated)
              <input
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2"
                value={profile.skills}
                onChange={(event) => setProfile((prev) => ({ ...prev, skills: event.target.value }))}
              />
            </label>
            <label className="text-sm text-slate-800 md:col-span-2">
              Interests (comma separated)
              <input
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2"
                value={profile.interests}
                onChange={(event) => setProfile((prev) => ({ ...prev, interests: event.target.value }))}
              />
            </label>
            <label className="text-sm text-slate-800 md:col-span-2">
              Location Preference
              <input
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2"
                value={profile.locationPreference}
                onChange={(event) => setProfile((prev) => ({ ...prev, locationPreference: event.target.value }))}
                placeholder="Remote / Karachi / Germany"
              />
            </label>
            <label className="text-sm text-slate-800 md:col-span-2">
              Past Experience (comma separated)
              <input
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2"
                value={profile.pastExperience}
                onChange={(event) => setProfile((prev) => ({ ...prev, pastExperience: event.target.value }))}
              />
            </label>
          </div>

          <div className="mt-3">
            <p className="text-sm text-slate-800">Preferred Opportunity Types</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {typeOptions.map((item) => {
                const checked = profile.preferredOpportunityTypes.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleType(item)}
                    className={`rounded-full border px-3 py-1 text-sm ${
                      checked
                        ? "border-cyan-300/50 bg-cyan-100 text-cyan-900"
                        : "border-black/10 bg-white text-slate-700"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-black/10 bg-white/45 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-700">Opportunity Emails</h3>
          <p className="mt-2 text-sm text-slate-700">
            Paste email bodies and separate each email using a standalone line with ---
          </p>
          <textarea
            className="mt-3 min-h-[260px] w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
            value={emailsInput}
            onChange={(event) => setEmailsInput(event.target.value)}
            placeholder={"Email 1 body...\n\n---\n\nEmail 2 body..."}
          />

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm">
              <Upload className="size-4" />
              Upload .txt
              <input type="file" accept=".txt,text/plain" onChange={onFileUpload} className="hidden" />
            </label>
            <Button onClick={submitForAnalysis} disabled={loading || !user}>
              <Sparkles className="size-4" />
              {loading ? "Analyzing..." : "Analyze Inbox"}
            </Button>
          </div>
        </article>
      </div>

      {error ? (
        <p className="mt-4 rounded-2xl border border-red-300/30 bg-red-50 p-3 text-sm text-red-900">{error}</p>
      ) : null}

      {result ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-2xl border border-black/10 bg-white/55 p-4 text-sm text-slate-700">
            <p>Generated at: {new Date(result.generated_at).toLocaleString()}</p>
            <p>Ranked opportunities: {result.ranked_opportunities.length}</p>
            <p>Rejected as non-opportunities: {result.rejected_items.length}</p>
          </div>

          {result.ranked_opportunities.map((item, idx) => (
            <article key={`${item.source_email_index}-${item.title}`} className="rounded-2xl border border-black/10 bg-white/55 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-cyan-700">Rank #{idx + 1}</p>
                  <h3 className="mt-1 text-xl font-semibold text-black">{item.title}</h3>
                  <p className="text-sm text-slate-700">
                    {item.opportunity_type} {item.organization ? `• ${item.organization}` : ""}
                  </p>
                </div>
                <div className="rounded-xl border border-emerald-300/40 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900">
                  Score: {item.priority_score}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3 text-sm">
                <div className="rounded-xl border border-black/10 bg-white p-3">Fit: {item.fit_score}</div>
                <div className="rounded-xl border border-black/10 bg-white p-3">Urgency: {item.urgency_score}</div>
                <div className="rounded-xl border border-black/10 bg-white p-3">Completeness: {item.completeness_score}</div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-black/10 bg-white p-3">
                  <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <CheckCircle2 className="size-4 text-emerald-700" /> Why it matches
                  </p>
                  <ul className="space-y-1 text-sm text-slate-700">
                    {item.why_it_matches.map((reason, i) => (
                      <li key={`${reason}-${i}`}>• {reason}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-black/10 bg-white p-3">
                  <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <ListChecks className="size-4 text-cyan-700" /> Action checklist
                  </p>
                  <ul className="space-y-1 text-sm text-slate-700">
                    {item.action_checklist.map((todo, i) => (
                      <li key={`${todo}-${i}`}>• {todo}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {item.links.length > 0 ? (
                <div className="mt-4 rounded-xl border border-black/10 bg-white p-3 text-sm">
                  <p className="font-semibold text-slate-800">Links</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {item.links.map((link) => (
                      <a
                        key={link}
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-cyan-300/40 bg-cyan-50 px-3 py-1 text-cyan-900"
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
            </article>
          ))}

          {result.rejected_items.length > 0 ? (
            <article className="rounded-2xl border border-amber-300/30 bg-amber-50 p-4">
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-900">
                <AlertCircle className="size-4" /> Filtered Out (Not Genuine Opportunities)
              </p>
              <ul className="space-y-1 text-sm text-amber-900">
                {result.rejected_items.map((item) => (
                  <li key={`${item.source_email_index}-${item.title}`}>
                    • Email #{item.source_email_index}: {item.title || "Untitled"}
                    {item.spam_reason ? ` — ${item.spam_reason}` : ""}
                  </li>
                ))}
              </ul>
            </article>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
