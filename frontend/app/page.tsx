import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MeshGradientBackground } from "@/components/ui/mesh-gradient-background";

export default function Home() {
  return (
    <MeshGradientBackground contentClassName="px-6 py-10 text-black md:px-10 lg:px-16">
      <main className="relative min-h-screen">
        <section className="relative mx-auto flex w-full max-w-7xl flex-col gap-10">
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <header className="rounded-[2rem] border border-black/10 bg-white/30 p-8 backdrop-blur-sm md:p-12">
              <p className="text-center text-xs uppercase tracking-[0.32em] text-slate-700">Opportunity Inbox Copilot</p>
              <h1 className="mx-auto mt-4 max-w-4xl text-center text-4xl font-semibold leading-tight text-black md:text-6xl">
                Turn cluttered emails into ranked opportunities you can act on fast.
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-center text-sm text-slate-700 md:text-base">
                Start on the landing page, continue to Firebase sign up or login, and then open the functionality page
                where you can paste 5 to 15 opportunity emails and get evidence-backed rankings.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild className="bg-amber-300 text-slate-950 hover:bg-amber-200">
                  <Link href="/auth">
                    Go to sign up / login
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-black/10 bg-white/40 p-4">
                  <Sparkles className="size-5 text-amber-500" />
                  <h2 className="mt-3 text-base font-semibold text-black">Parse emails</h2>
                  <p className="mt-1 text-sm text-slate-700">Extract real opportunities and ignore junk.</p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white/40 p-4">
                  <ShieldCheck className="size-5 text-cyan-500" />
                  <h2 className="mt-3 text-base font-semibold text-black">Rank by fit</h2>
                  <p className="mt-1 text-sm text-slate-700">Score against your profile deterministically.</p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white/40 p-4">
                  <ArrowRight className="size-5 text-emerald-500" />
                  <h2 className="mt-3 text-base font-semibold text-black">Functionality page</h2>
                  <p className="mt-1 text-sm text-slate-700">Review rankings, evidence, and action checklists.</p>
                </div>
              </div>
            </header>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <article className="rounded-3xl border border-black/10 bg-white/30 p-6 backdrop-blur-sm">
              <Sparkles className="size-5 text-amber-500" />
              <h2 className="mt-4 text-xl font-semibold text-black">Step 1: Add your profile</h2>
              <p className="mt-2 text-sm text-slate-700">Enter degree, semester, CGPA, skills, interests, and preferences.</p>
            </article>
            <article className="rounded-3xl border border-black/10 bg-white/30 p-6 backdrop-blur-sm">
              <ShieldCheck className="size-5 text-cyan-500" />
              <h2 className="mt-4 text-xl font-semibold text-black">Step 2: Sign up / Login</h2>
              <p className="mt-2 text-sm text-slate-700">Use Firebase Google sign-in to unlock the next page.</p>
            </article>
            <article className="rounded-3xl border border-black/10 bg-white/30 p-6 backdrop-blur-sm">
              <ArrowRight className="size-5 text-emerald-500" />
              <h2 className="mt-4 text-xl font-semibold text-black">Step 3: Functionality page</h2>
              <p className="mt-2 text-sm text-slate-700">Paste emails, rank opportunities, and review action checklists.</p>
            </article>
          </section>
        </section>
      </main>
    </MeshGradientBackground>
  );
}
