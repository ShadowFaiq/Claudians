export type OpportunityType =
  | "scholarship"
  | "internship"
  | "fellowship"
  | "competition"
  | "research"
  | "admission"
  | "course"
  | "spam"
  | "unknown";

export interface StudentProfile {
  name: string;
  degree: string;
  semester: number;
  cgpa: number;
  skills: string[];
  preferredTypes: OpportunityType[];
  financialNeed: boolean;
  location: string;
  experience: string;
}

export interface ExtractedOpportunity {
  emailIndex: number;
  isOpportunity: boolean;
  title: string;
  type: OpportunityType;
  organization: string;
  deadline: string | null;
  deadlineRaw: string | null;
  eligibility: string | null;
  minCGPA: number | null;
  requiredDocs: string[];
  skills: string[];
  applicationLink: string | null;
  contactEmail: string | null;
  fundingMentioned: boolean;
  location: string | null;
  degreeRequirement: string | null;
  isStrictDegree: boolean;
  summary: string;
  rawSnippet: string;
}

export interface ScoreBreakdown {
  fit: number;
  urgency: number;
  completeness: number;
  prestige: number;
  total: number;
  evidence: string[];
}

export interface RankedOpportunity {
  rank: number;
  opportunity: ExtractedOpportunity;
  score: ScoreBreakdown;
  actionChecklist: string[];
  daysUntilDeadline: number | null;
}

export interface AnalyzeRequest {
  emails: string;
  profile: StudentProfile;
}

export interface AnalyzeResponse {
  results: RankedOpportunity[];
  spamCount: number;
  processedAt: string;
}
