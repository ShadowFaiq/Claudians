import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import type { ExtractedOpportunity } from "./types";

const responseSchema = {
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      emailIndex: { type: SchemaType.NUMBER },
      isOpportunity: { type: SchemaType.BOOLEAN },
      title: { type: SchemaType.STRING },
      type: {
        type: SchemaType.STRING,
        enum: ["scholarship", "internship", "fellowship", "competition", "research", "admission", "course", "spam", "unknown"],
      },
      organization: { type: SchemaType.STRING },
      deadline: { type: SchemaType.STRING, nullable: true },
      deadlineRaw: { type: SchemaType.STRING, nullable: true },
      eligibility: { type: SchemaType.STRING, nullable: true },
      minCGPA: { type: SchemaType.NUMBER, nullable: true },
      requiredDocs: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
      skills: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
      applicationLink: { type: SchemaType.STRING, nullable: true },
      contactEmail: { type: SchemaType.STRING, nullable: true },
      fundingMentioned: { type: SchemaType.BOOLEAN },
      location: { type: SchemaType.STRING, nullable: true },
      degreeRequirement: { type: SchemaType.STRING, nullable: true },
      isStrictDegree: { type: SchemaType.BOOLEAN },
      summary: { type: SchemaType.STRING },
      rawSnippet: { type: SchemaType.STRING },
    },
    required: [
      "emailIndex", "isOpportunity", "title", "type", "organization",
      "requiredDocs", "skills", "fundingMentioned", "isStrictDegree", "summary", "rawSnippet"
    ],
  },
};

export async function extractOpportunities(emailsText: string): Promise<ExtractedOpportunity[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: responseSchema as never,
    },
  });

  const emails = emailsText.split(/\n---+\n/).map((e, i) => `[EMAIL ${i}]\n${e.trim()}`).filter(e => e.length > 20);

  const prompt = `You are an expert at parsing student opportunity emails. Analyze these ${emails.length} emails and extract structured information.

For each email:
- Set isOpportunity=false for promotional spam, course registration notices, or non-opportunity content
- Extract the EXACT deadline as ISO date (YYYY-MM-DD) in the "deadline" field
- Put the original deadline text in "deadlineRaw"
- Extract all required documents as an array
- Extract required technical skills as an array
- Set fundingMentioned=true only if stipend, scholarship money, or financial support is mentioned
- Set minCGPA to the numeric minimum CGPA if stated, null otherwise
- For "type": use "spam" for promotional emails, "course" for course registrations
- rawSnippet: first 120 chars of the email body
- Never hallucinate links or emails — extract only what's literally present

Emails to analyze:
${emails.join("\n\n")}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const parsed = JSON.parse(text) as ExtractedOpportunity[];
  return parsed;
}
