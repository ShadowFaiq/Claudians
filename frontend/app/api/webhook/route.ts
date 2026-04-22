import { NextRequest, NextResponse } from "next/server";
import { extractOpportunities } from "@/lib/gemini";
import { scoreOpportunities } from "@/lib/scoringEngine";
import { DEFAULT_PROFILE } from "@/lib/sampleData";
import type { AnalyzeRequest, AnalyzeResponse } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body: Partial<AnalyzeRequest> = await req.json();
    if (!body.emails?.trim()) {
      return NextResponse.json({ error: "No emails provided" }, { status: 400 });
    }
    const profile = body.profile ?? DEFAULT_PROFILE;
    const extracted = await extractOpportunities(body.emails);
    const ranked = scoreOpportunities(extracted, profile);
    const response: AnalyzeResponse = {
      results: ranked,
      spamCount: extracted.filter(e => !e.isOpportunity).length,
      processedAt: new Date().toISOString(),
    };
    return NextResponse.json(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook processing failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
