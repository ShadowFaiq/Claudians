import json
import os
import re
from urllib import error as urlerror
from urllib import request as urlrequest
from typing import Any
from datetime import UTC, datetime

import firebase_admin
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Security, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from firebase_admin import auth, credentials, firestore
from pydantic import BaseModel, Field

load_dotenv()

app = FastAPI()
bearer_scheme = HTTPBearer(auto_error=False)

DEFAULT_METRICS: list[dict[str, str]] = [
    {
        "title": "API Health",
        "value": "Online",
        "detail": "FastAPI is reachable from the dashboard.",
        "tone": "success",
    },
    {
        "title": "Active Members",
        "value": "128",
        "detail": "+12 since yesterday",
        "tone": "info",
    },
    {
        "title": "Deploy Queue",
        "value": "04",
        "detail": "2 waiting for review",
        "tone": "neutral",
    },
    {
        "title": "Incident Alerts",
        "value": "01",
        "detail": "Latency spike on /api/health",
        "tone": "neutral",
    },
]

SPAM_KEYWORDS = {
    "unsubscribe",
    "discount",
    "promo",
    "flash sale",
    "buy now",
    "lottery",
    "casino",
    "crypto signal",
}

OPPORTUNITY_TYPE_KEYWORDS: dict[str, tuple[str, ...]] = {
    "scholarship": ("scholarship", "tuition grant", "financial aid", "stipend"),
    "internship": ("internship", "intern", "summer intern"),
    "fellowship": ("fellowship", "research fellow"),
    "job": ("job", "hiring", "full-time", "part-time", "position"),
    "competition": ("competition", "hackathon", "challenge", "contest"),
    "conference": ("conference", "summit", "workshop", "bootcamp"),
}

DOCUMENT_HINTS: dict[str, tuple[str, ...]] = {
    "Resume/CV": ("resume", "cv"),
    "Transcript": ("transcript",),
    "Statement of Purpose": ("statement of purpose", "sop", "motivation letter"),
    "Recommendation Letter": ("recommendation", "reference letter"),
    "Portfolio": ("portfolio", "github", "dribbble", "behance"),
}

SKILL_KEYWORDS: dict[str, tuple[str, ...]] = {
    "python": ("python",),
    "javascript": ("javascript", "js", "node.js", "nodejs"),
    "react": ("react", "next.js", "nextjs"),
    "sql": ("sql", "postgres", "mysql", "database"),
    "machine learning": ("machine learning", "ml", "deep learning"),
    "data analysis": ("data analysis", "analytics", "pandas", "numpy"),
    "cloud": ("cloud", "aws", "gcp", "azure"),
    "fastapi": ("fastapi", "api development", "rest api"),
    "git": ("git", "github", "version control"),
}

SKILL_RESOURCES: dict[str, list[dict[str, str]]] = {
    "python": [
        {"title": "Python for Everybody", "provider": "Coursera", "url": "https://www.coursera.org/specializations/python"},
        {"title": "Python Docs Tutorial", "provider": "Python", "url": "https://docs.python.org/3/tutorial/"},
    ],
    "javascript": [
        {"title": "JavaScript Guide", "provider": "MDN", "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide"},
        {"title": "The Modern JavaScript Tutorial", "provider": "javascript.info", "url": "https://javascript.info/"},
    ],
    "react": [
        {"title": "React Learn", "provider": "React", "url": "https://react.dev/learn"},
        {"title": "Next.js Learn", "provider": "Vercel", "url": "https://nextjs.org/learn"},
    ],
    "sql": [
        {"title": "SQLBolt", "provider": "SQLBolt", "url": "https://sqlbolt.com/"},
        {"title": "Intro to SQL", "provider": "Khan Academy", "url": "https://www.khanacademy.org/computing/computer-programming/sql"},
    ],
    "machine learning": [
        {"title": "Machine Learning Specialization", "provider": "Coursera", "url": "https://www.coursera.org/specializations/machine-learning-introduction"},
        {"title": "scikit-learn Tutorials", "provider": "scikit-learn", "url": "https://scikit-learn.org/stable/tutorial/"},
    ],
    "data analysis": [
        {"title": "Data Analysis with Python", "provider": "freeCodeCamp", "url": "https://www.freecodecamp.org/learn/data-analysis-with-python/"},
        {"title": "Pandas User Guide", "provider": "Pandas", "url": "https://pandas.pydata.org/docs/user_guide/index.html"},
    ],
    "cloud": [
        {"title": "AWS Cloud Practitioner Essentials", "provider": "AWS", "url": "https://www.aws.training/Details/Curriculum?id=20685"},
        {"title": "Google Cloud Skills Boost", "provider": "Google Cloud", "url": "https://www.cloudskillsboost.google/"},
    ],
    "fastapi": [
        {"title": "FastAPI Tutorial", "provider": "FastAPI", "url": "https://fastapi.tiangolo.com/tutorial/"},
        {"title": "Build APIs with Python", "provider": "Real Python", "url": "https://realpython.com/tutorials/api/"},
    ],
    "git": [
        {"title": "Git Handbook", "provider": "GitHub", "url": "https://guides.github.com/introduction/git-handbook/"},
        {"title": "Learn Git Branching", "provider": "Learn Git Branching", "url": "https://learngitbranching.js.org/"},
    ],
}


class StudentProfile(BaseModel):
    degree_program: str = Field(..., min_length=2, max_length=120)
    semester: int = Field(..., ge=1, le=20)
    cgpa: float = Field(..., ge=0.0, le=4.0)
    skills: list[str] = Field(default_factory=list)
    interests: list[str] = Field(default_factory=list)
    preferred_opportunity_types: list[str] = Field(default_factory=list)
    financial_need: str = Field(default="medium")
    location_preference: str = Field(default="")
    past_experience: list[str] = Field(default_factory=list)


class OpportunityInboxRequest(BaseModel):
    profile: StudentProfile
    emails: list[str] = Field(..., min_length=5, max_length=15)


class ExtractedOpportunity(BaseModel):
    source_email_index: int
    is_genuine: bool
    spam_reason: str | None = None
    opportunity_type: str = "unknown"
    title: str = ""
    organization: str = ""
    deadline_iso: str | None = None
    eligibility_criteria: list[str] = Field(default_factory=list)
    required_documents: list[str] = Field(default_factory=list)
    required_skills: list[str] = Field(default_factory=list)
    links: list[str] = Field(default_factory=list)
    contact_info: list[str] = Field(default_factory=list)
    evidence: list[str] = Field(default_factory=list)
    extraction_confidence: float = 0.4


class RankedOpportunity(BaseModel):
    source_email_index: int
    opportunity_type: str
    title: str
    organization: str
    deadline_iso: str | None = None
    priority_score: float
    fit_score: float
    urgency_score: float
    completeness_score: float
    why_it_matches: list[str]
    action_checklist: list[str]
    evidence: list[str]
    links: list[str]
    contact_info: list[str]
    required_documents: list[str]
    missing_skills: list[str]
    learning_resources: list[dict[str, str]]


class OpportunityInboxResponse(BaseModel):
    generated_at: str
    ranked_opportunities: list[RankedOpportunity]
    rejected_items: list[ExtractedOpportunity]


def _initialize_firebase_admin() -> None:
    if firebase_admin._apps:
        return

    service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")
    service_account_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")

    if service_account_path:
        admin_credential = credentials.Certificate(service_account_path)
    elif service_account_json:
        account_info = json.loads(service_account_json)
        admin_credential = credentials.Certificate(account_info)
    else:
        raise RuntimeError(
            "Firebase Admin is not configured. Set FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT_JSON."
        )

    firebase_admin.initialize_app(admin_credential)


def _extract_json_object(raw_text: str) -> dict[str, Any] | None:
    start = raw_text.find("{")
    end = raw_text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        return None

    try:
        return json.loads(raw_text[start : end + 1])
    except json.JSONDecodeError:
        return None


def _parse_deadline_iso(email_text: str) -> str | None:
    patterns = [
        (r"\b(20\d{2}-\d{2}-\d{2})\b", ["%Y-%m-%d"]),
        (r"\b(\d{1,2}/\d{1,2}/20\d{2})\b", ["%d/%m/%Y", "%m/%d/%Y"]),
        (
            r"\b(\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+20\d{2})\b",
            ["%d %B %Y", "%d %b %Y"],
        ),
    ]

    lowered = email_text.lower()
    for pattern, formats in patterns:
        match = re.search(pattern, lowered, re.IGNORECASE)
        if not match:
            continue

        value = match.group(1)
        for fmt in formats:
            try:
                parsed = datetime.strptime(value, fmt).replace(tzinfo=UTC)
                return parsed.isoformat()
            except ValueError:
                continue

    return None


def _heuristic_extract(email_text: str, index: int) -> ExtractedOpportunity:
    lowered = email_text.lower()
    first_line = next((line.strip() for line in email_text.splitlines() if line.strip()), "Opportunity Update")
    title = first_line[:140]

    spam_hits = [keyword for keyword in SPAM_KEYWORDS if keyword in lowered]
    opportunity_hits = [
        opportunity_type
        for opportunity_type, keywords in OPPORTUNITY_TYPE_KEYWORDS.items()
        if any(keyword in lowered for keyword in keywords)
    ]

    is_genuine = bool(opportunity_hits) and not spam_hits
    opportunity_type = opportunity_hits[0] if opportunity_hits else "unknown"

    links = re.findall(r"https?://[^\s)]+", email_text)
    contacts = re.findall(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", email_text)

    documents: list[str] = []
    for doc_name, hints in DOCUMENT_HINTS.items():
        if any(hint in lowered for hint in hints):
            documents.append(doc_name)

    required_skills: list[str] = []
    for skill_name, hints in SKILL_KEYWORDS.items():
        if any(hint in lowered for hint in hints):
            required_skills.append(skill_name)

    eligibility_lines = [
        line.strip()
        for line in email_text.splitlines()
        if re.search(r"eligib|require|criteria|cgpa|gpa|semester|major", line, re.IGNORECASE)
    ]

    evidence = []
    if opportunity_hits:
        evidence.append(f"Detected opportunity keywords: {', '.join(opportunity_hits)}")
    if links:
        evidence.append("Includes submission/reference link(s)")
    if documents:
        evidence.append(f"Mentions required documents: {', '.join(documents)}")
    if required_skills:
        evidence.append(f"Mentions required skills: {', '.join(required_skills)}")

    confidence = 0.45
    if opportunity_hits:
        confidence += 0.2
    if links:
        confidence += 0.15
    if documents:
        confidence += 0.1
    confidence = min(confidence, 0.95)

    organization = ""
    org_match = re.search(r"(?:by|from|at)\s+([A-Z][A-Za-z0-9& .-]{2,60})", email_text)
    if org_match:
        organization = org_match.group(1).strip()

    return ExtractedOpportunity(
        source_email_index=index,
        is_genuine=is_genuine,
        spam_reason="Spam-like promotional language detected" if spam_hits else None,
        opportunity_type=opportunity_type,
        title=title,
        organization=organization,
        deadline_iso=_parse_deadline_iso(email_text),
        eligibility_criteria=eligibility_lines[:6],
        required_documents=documents,
        required_skills=required_skills,
        links=links[:6],
        contact_info=contacts[:4],
        evidence=evidence,
        extraction_confidence=confidence,
    )


def _extract_with_openai(email_text: str, index: int) -> ExtractedOpportunity | None:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return None

    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    system_prompt = (
        "Extract scholarship/internship opportunities from emails. "
        "Return strict JSON only with keys: "
        "is_genuine, spam_reason, opportunity_type, title, organization, deadline_iso, "
        "eligibility_criteria, required_documents, links, contact_info, evidence, extraction_confidence."
    )

    payload = {
        "model": model,
        "temperature": 0,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": email_text},
        ],
        "response_format": {"type": "json_object"},
    }

    req = urlrequest.Request(
        "https://api.openai.com/v1/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urlrequest.urlopen(req, timeout=18) as response:
            body = json.loads(response.read().decode("utf-8"))
    except (urlerror.URLError, TimeoutError, json.JSONDecodeError):
        return None

    content = (
        body.get("choices", [{}])[0]
        .get("message", {})
        .get("content", "")
    )
    extracted = _extract_json_object(content)
    if not extracted:
        return None

    return ExtractedOpportunity(
        source_email_index=index,
        is_genuine=bool(extracted.get("is_genuine", False)),
        spam_reason=extracted.get("spam_reason"),
        opportunity_type=str(extracted.get("opportunity_type", "unknown")),
        title=str(extracted.get("title", "Opportunity Update")),
        organization=str(extracted.get("organization", "")),
        deadline_iso=extracted.get("deadline_iso"),
        eligibility_criteria=[str(v) for v in extracted.get("eligibility_criteria", []) if isinstance(v, str)],
        required_documents=[str(v) for v in extracted.get("required_documents", []) if isinstance(v, str)],
        required_skills=[str(v).strip().lower() for v in extracted.get("required_skills", []) if isinstance(v, str)],
        links=[str(v) for v in extracted.get("links", []) if isinstance(v, str)],
        contact_info=[str(v) for v in extracted.get("contact_info", []) if isinstance(v, str)],
        evidence=[str(v) for v in extracted.get("evidence", []) if isinstance(v, str)],
        extraction_confidence=float(extracted.get("extraction_confidence", 0.6)),
    )


def _extract_opportunity(email_text: str, index: int) -> ExtractedOpportunity:
    llm_result = _extract_with_openai(email_text=email_text, index=index)
    if llm_result:
        return llm_result

    return _heuristic_extract(email_text=email_text, index=index)


def _compute_fit_score(extracted: ExtractedOpportunity, profile: StudentProfile) -> tuple[float, list[str]]:
    reasons: list[str] = []
    score = 25.0

    normalized_type = extracted.opportunity_type.lower()
    preferred = [item.lower() for item in profile.preferred_opportunity_types]
    if normalized_type in preferred:
        score += 25
        reasons.append(f"Matches preferred type: {extracted.opportunity_type}")

    haystack = " ".join(
        [
            extracted.title,
            extracted.organization,
            " ".join(extracted.eligibility_criteria),
            " ".join(extracted.evidence),
        ]
    ).lower()

    skill_hits = [skill for skill in profile.skills if skill.lower() in haystack]
    if skill_hits:
        skill_bonus = min(25, 6 * len(skill_hits))
        score += skill_bonus
        reasons.append(f"Skill alignment found: {', '.join(skill_hits[:4])}")

    interest_hits = [interest for interest in profile.interests if interest.lower() in haystack]
    if interest_hits:
        score += min(15, 4 * len(interest_hits))
        reasons.append(f"Interest alignment found: {', '.join(interest_hits[:3])}")

    if profile.location_preference and profile.location_preference.lower() in haystack:
        score += 8
        reasons.append("Location preference appears in opportunity details")

    cgpa_match = re.search(r"(?:cgpa|gpa)[^\d]{0,8}(\d(?:\.\d+)?)", haystack)
    if cgpa_match:
        min_cgpa = float(cgpa_match.group(1))
        if profile.cgpa >= min_cgpa:
            score += 10
            reasons.append(f"CGPA meets requirement (required {min_cgpa})")
        else:
            score -= 20
            reasons.append(f"CGPA below requirement (required {min_cgpa})")

    if extracted.required_skills:
        profile_skill_tokens = {skill.strip().lower() for skill in profile.skills if skill.strip()}
        matched_required = [skill for skill in extracted.required_skills if skill in profile_skill_tokens]
        missing_required = [skill for skill in extracted.required_skills if skill not in profile_skill_tokens]

        if matched_required:
            score += min(12, 4 * len(matched_required))
            reasons.append(f"Required skills already present: {', '.join(matched_required)}")

        if missing_required:
            score -= min(18, 6 * len(missing_required))
            reasons.append(f"Skill gaps detected: {', '.join(missing_required)}")

    score = max(0.0, min(score, 100.0))
    return score, reasons


def _compute_urgency_score(deadline_iso: str | None) -> tuple[float, list[str]]:
    if not deadline_iso:
        return 45.0, ["No explicit deadline detected"]

    try:
        deadline = datetime.fromisoformat(deadline_iso.replace("Z", "+00:00"))
    except ValueError:
        return 45.0, ["Deadline format unclear"]

    now = datetime.now(UTC)
    remaining_days = (deadline - now).days
    if remaining_days < 0:
        return 0.0, ["Deadline appears to have passed"]
    if remaining_days <= 3:
        return 100.0, [f"Very urgent: {remaining_days} day(s) left"]
    if remaining_days <= 7:
        return 85.0, [f"Urgent: {remaining_days} day(s) left"]
    if remaining_days <= 14:
        return 70.0, [f"Moderate urgency: {remaining_days} day(s) left"]
    if remaining_days <= 30:
        return 55.0, [f"Upcoming deadline in {remaining_days} day(s)"]

    return 40.0, ["Deadline is not immediate"]


def _compute_completeness_score(extracted: ExtractedOpportunity) -> tuple[float, list[str]]:
    checks = {
        "title": bool(extracted.title),
        "opportunity_type": extracted.opportunity_type != "unknown",
        "deadline": bool(extracted.deadline_iso),
        "eligibility": bool(extracted.eligibility_criteria),
        "required_documents": bool(extracted.required_documents),
        "links": bool(extracted.links),
        "contact_info": bool(extracted.contact_info),
    }
    completed = sum(1 for ok in checks.values() if ok)
    score = round((completed / len(checks)) * 100, 2)

    missing = [name.replace("_", " ") for name, ok in checks.items() if not ok]
    if not missing:
        reasons = ["All major fields extracted"]
    else:
        reasons = [f"Missing fields: {', '.join(missing)}"]

    return score, reasons


def _build_action_checklist(extracted: ExtractedOpportunity, urgency_reasons: list[str]) -> list[str]:
    checklist = ["Read eligibility criteria and confirm fit."]

    if extracted.required_documents:
        for doc in extracted.required_documents:
            checklist.append(f"Prepare document: {doc}.")
    else:
        checklist.append("Identify required documents from the official post/email.")

    if extracted.deadline_iso:
        checklist.append(f"Submit before deadline: {extracted.deadline_iso}.")
    else:
        checklist.append("Find and verify the official deadline before applying.")

    if extracted.links:
        checklist.append(f"Open and verify application link: {extracted.links[0]}")

    if extracted.contact_info:
        checklist.append(f"Contact organizer if needed: {extracted.contact_info[0]}")

    if extracted.required_skills:
        checklist.append(f"Check skill readiness for: {', '.join(extracted.required_skills)}")

    checklist.extend([f"Urgency note: {note}" for note in urgency_reasons])
    return checklist


def _build_learning_resources(missing_skills: list[str]) -> list[dict[str, str]]:
    resources: list[dict[str, str]] = []
    seen_urls: set[str] = set()

    for skill in missing_skills:
        for resource in SKILL_RESOURCES.get(skill, []):
            url = resource.get("url", "")
            if not url or url in seen_urls:
                continue

            resources.append({
                "skill": skill,
                "title": resource.get("title", "Learning resource"),
                "provider": resource.get("provider", "Unknown"),
                "url": url,
            })
            seen_urls.add(url)

    return resources


def _rank_opportunity(extracted: ExtractedOpportunity, profile: StudentProfile) -> RankedOpportunity:
    fit_score, fit_reasons = _compute_fit_score(extracted=extracted, profile=profile)
    urgency_score, urgency_reasons = _compute_urgency_score(deadline_iso=extracted.deadline_iso)
    completeness_score, completeness_reasons = _compute_completeness_score(extracted=extracted)

    priority_score = round((fit_score * 0.5) + (urgency_score * 0.3) + (completeness_score * 0.2), 2)

    reasons = [*fit_reasons, *urgency_reasons, *completeness_reasons]
    action_checklist = _build_action_checklist(extracted=extracted, urgency_reasons=urgency_reasons)
    profile_skill_tokens = {skill.strip().lower() for skill in profile.skills if skill.strip()}
    missing_skills = [skill for skill in extracted.required_skills if skill not in profile_skill_tokens]
    learning_resources = _build_learning_resources(missing_skills)

    if missing_skills:
        reasons.append(f"Upskilling suggested for: {', '.join(missing_skills)}")
        action_checklist.append(f"Start upskilling now: {', '.join(missing_skills)}")

    return RankedOpportunity(
        source_email_index=extracted.source_email_index,
        opportunity_type=extracted.opportunity_type,
        title=extracted.title,
        organization=extracted.organization,
        deadline_iso=extracted.deadline_iso,
        priority_score=priority_score,
        fit_score=round(fit_score, 2),
        urgency_score=round(urgency_score, 2),
        completeness_score=round(completeness_score, 2),
        why_it_matches=reasons,
        action_checklist=action_checklist,
        evidence=extracted.evidence,
        links=extracted.links,
        contact_info=extracted.contact_info,
        required_documents=extracted.required_documents,
        missing_skills=missing_skills,
        learning_resources=learning_resources,
    )


def verify_firebase_user(
    auth_credentials: HTTPAuthorizationCredentials | None = Security(bearer_scheme),
) -> dict[str, Any]:
    if auth_credentials is None or auth_credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Authorization header.",
        )

    try:
        _initialize_firebase_admin()
        return auth.verify_id_token(auth_credentials.credentials)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token verification failed: {exc}",
        ) from exc


def _get_firestore_client() -> firestore.client:
    _initialize_firebase_admin()
    return firestore.client()


def _normalized_metric(metric: dict[str, Any]) -> dict[str, str]:
    tone = str(metric.get("tone", "neutral"))
    if tone not in {"success", "info", "neutral"}:
        tone = "neutral"

    return {
        "title": str(metric.get("title", "Untitled")),
        "value": str(metric.get("value", "-")),
        "detail": str(metric.get("detail", "")),
        "tone": tone,
    }


def _read_or_seed_metrics_document() -> tuple[list[dict[str, str]], str]:
    db = _get_firestore_client()
    metrics_ref = db.collection("dashboard").document("metrics")
    snapshot = metrics_ref.get()

    if not snapshot.exists:
        metrics_ref.set({"metrics": DEFAULT_METRICS, "updatedAt": firestore.SERVER_TIMESTAMP})
        snapshot = metrics_ref.get()

    payload = snapshot.to_dict() or {}
    raw_metrics = payload.get("metrics", [])

    metrics: list[dict[str, str]] = []
    if isinstance(raw_metrics, list):
        metrics = [_normalized_metric(item) for item in raw_metrics if isinstance(item, dict)]

    if not metrics:
        metrics = DEFAULT_METRICS
        metrics_ref.set({"metrics": metrics, "updatedAt": firestore.SERVER_TIMESTAMP}, merge=True)
        snapshot = metrics_ref.get()
        payload = snapshot.to_dict() or {}

    updated_at = payload.get("updatedAt")
    if hasattr(updated_at, "isoformat"):
        generated_at = updated_at.isoformat()
    else:
        generated_at = datetime.now(UTC).isoformat()

    return metrics, generated_at


frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

# This allows your Next.js frontend to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {
        "status": "Backend is online and reachable",
        "role": "AWS Cloud Club Captain API"
    }


@app.get("/api/auth/me")
async def get_authenticated_user(decoded_token: dict[str, Any] = Depends(verify_firebase_user)):
    return {
        "authenticated": True,
        "uid": decoded_token.get("uid"),
        "email": decoded_token.get("email"),
        "name": decoded_token.get("name"),
    }


@app.get("/api/dashboard/metrics")
async def get_dashboard_metrics(decoded_token: dict[str, Any] = Depends(verify_firebase_user)):
    try:
        metrics, generated_at = _read_or_seed_metrics_document()
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Failed to read dashboard metrics from Firestore: {exc}",
        ) from exc

    viewer = decoded_token.get("email") or decoded_token.get("uid", "Unknown user")
    metrics_with_viewer = [
        *metrics,
        {
            "title": "Signed-in User",
            "value": str(viewer),
            "detail": "Authenticated via Firebase token.",
            "tone": "info",
        },
        {
            "title": "Token Status",
            "value": "Verified",
            "detail": "Bearer token validated on backend.",
            "tone": "success",
        },
    ]

    return {
        "generatedAt": generated_at,
        "metrics": metrics_with_viewer,
    }


@app.post("/api/opportunity-inbox/analyze", response_model=OpportunityInboxResponse)
async def analyze_opportunity_inbox(
    payload: OpportunityInboxRequest,
    decoded_token: dict[str, Any] = Depends(verify_firebase_user),
):
    if len(payload.emails) < 5 or len(payload.emails) > 15:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Provide between 5 and 15 emails.",
        )

    del decoded_token

    extracted_items = [
        _extract_opportunity(email_text=email_body, index=index + 1)
        for index, email_body in enumerate(payload.emails)
    ]

    genuine_items = [item for item in extracted_items if item.is_genuine]
    rejected_items = [item for item in extracted_items if not item.is_genuine]

    ranked = [_rank_opportunity(item, payload.profile) for item in genuine_items]
    ranked.sort(key=lambda item: item.priority_score, reverse=True)

    return OpportunityInboxResponse(
        generated_at=datetime.now(UTC).isoformat(),
        ranked_opportunities=ranked,
        rejected_items=rejected_items,
    )