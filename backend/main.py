from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# This allows your Next.js frontend to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, you will change this to your Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {
        "status": "Backend is online and reachable",
        "role": "AWS Cloud Club Captain API" # Just a nod to your role!
    }