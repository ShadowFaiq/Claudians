import { OpportunityInboxCopilot } from "@/components/opportunity/opportunity-inbox-copilot";
import { ProtectedView } from "@/components/auth/protected-view";
import { MeshGradientBackground } from "@/components/ui/mesh-gradient-background";

export default function DashboardPage() {
  return (
    <ProtectedView>
      <MeshGradientBackground contentClassName="px-6 py-10 text-black md:px-10 lg:px-16">
        <main className="relative min-h-screen">
          <section className="relative mx-auto flex w-full max-w-7xl flex-col gap-8">
            <header className="rounded-[2rem] border border-black/10 bg-white/30 p-6 backdrop-blur-sm md:p-8">
              <p className="text-xs uppercase tracking-[0.32em] text-cyan-600">Opportunity Inbox Copilot</p>
              <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-black md:text-5xl">
                AI Parsing + Deterministic Ranking
              </h1>
              <p className="mt-4 max-w-4xl text-sm text-slate-700 md:text-base">
                Paste 5 to 15 opportunity emails and a structured student profile. The backend will classify genuine
                opportunities, extract key details, and return ranked results with evidence and action checklists.
              </p>
            </header>

            <section className="grid grid-cols-1 gap-4">
              <OpportunityInboxCopilot />
            </section>
          </section>
        </main>
      </MeshGradientBackground>
    </ProtectedView>
  );
}