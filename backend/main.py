import json
import os
from typing import Any

import firebase_admin
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Security, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from firebase_admin import auth, credentials

load_dotenv()

app = FastAPI()
bearer_scheme = HTTPBearer(auto_error=False)


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