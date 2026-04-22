import OpenAI from "openai";
import type { ExtractedOpportunity } from "./types";

export async function extractOpportunities(emailsText: string): Promise<ExtractedOpportunity[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not set");

  const client = new OpenAI({ apiKey });

  const emails = emailsText
    .split(/\n---+\n/)
    .map((e, i) => `[EMAIL ${i}]\n${e.trim()}`)
    .filter(e => e.length > 20);

  const prompt = `You are an expert at parsing student opportunity emails. Analyze these ${emails.length} emails and return a JSON object with key "opportunities" containing an array.

Each item in the array must have these exact fields:
- emailIndex (integer): index from 0
- isOpportunity (boolean): false for spam/promotional/course-registration
- title (string): short title of the opportunity
- type (string): one of scholarship|internship|fellowship|competition|research|admission|course|spam|unknown
- organization (string): sending organization
- deadline (string|null): ISO date YYYY-MM-DD or null
- deadlineRaw (string|null): original deadline text or null
- eligibility (string|null): eligibility summary or null
- minCGPA (number|null): minimum CGPA required or null
- requiredDocs (array of strings): required documents
- skills (array of strings): required skills
- applicationLink (string|null): application URL or null
- contactEmail (string|null): contact email or null
- fundingMentioned (boolean): true if stipend/scholarship money mentioned
- location (string|null): location or null
- degreeRequirement (string|null): required degree or null
- isStrictDegree (boolean): true if degree is a hard requirement
- summary (string): 1-2 sentence summary
- rawSnippet (string): first 120 chars of email body

Rules:
- Never hallucinate links or emails — only extract what is literally present
- Return null for any missing field (not empty string)

Emails to analyze:
${emails.join("\n\n")}

Respond with ONLY valid JSON: {"opportunities": [...]}`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const text = response.choices[0].message.content ?? '{"opportunities":[]}';
  const parsed = JSON.parse(text) as { opportunities: ExtractedOpportunity[] };
  return parsed.opportunities ?? [];
}
