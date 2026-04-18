import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthPanel } from "@/components/auth/auth-panel";
import { Button } from "@/components/ui/button";
import { MeshGradientBackground } from "@/components/ui/mesh-gradient-background";

export default function AuthPage() {
  return (
    <MeshGradientBackground contentClassName="px-6 py-10 text-black md:px-10 lg:px-16">
      <main className="relative min-h-screen">
        <section className="relative mx-auto flex w-full max-w-4xl flex-col gap-6">
          <div className="flex items-center justify-between gap-4 rounded-3xl border border-black/10 bg-white/30 p-5 backdrop-blur-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-600">Step 2</p>
              <h1 className="mt-2 text-2xl font-semibold text-black">Login / Sign up with Firebase</h1>
              <p className="mt-2 text-sm text-slate-700">Sign in here to continue to the functionality page.</p>
            </div>
            <Button asChild variant="ghost" className="text-black hover:bg-black/5">
              <Link href="/">
                <ArrowLeft className="size-4" />
                Back
              </Link>
            </Button>
          </div>

          <AuthPanel redirectTo="/dashboard" />
        </section>
      </main>
    </MeshGradientBackground>
  );
}