import { NextRequest, NextResponse } from "next/server";
import { extractOpportunities } from "@/lib/gemini";
import { scoreOpportunities } from "@/lib/scoringEngine";
import type { AnalyzeRequest, AnalyzeResponse } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body: AnalyzeRequest = await req.json();
    if (!body.emails?.trim()) {
      return NextResponse.json({ error: "No emails provided" }, { status: 400 });
    }

    const extracted = await extractOpportunities(body.emails);
    const ranked = scoreOpportunities(extracted, body.profile);
    const spamCount = extracted.filter(e => !e.isOpportunity).length;

    const response: AnalyzeResponse = {
      results: ranked,
      spamCount,
      processedAt: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
