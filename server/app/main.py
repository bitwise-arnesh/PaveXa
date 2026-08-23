from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ai.agent import run_agent
from app.routes.detection import router as detection_router


app = FastAPI(
    title="PaveXa API",
    description="Intelligent Road Infrastructure & Maintenance Platform",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://pavexa.vercel.app",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatReport(BaseModel):
    id: str
    latitude: float
    longitude: float
    damageType: str
    confidence: float | None = None
    riskScore: float
    riskLevel: str
    infrastructureRisk: float | None = None
    infrastructureData: str | None = None
    description: str | None = None
    status: str
    createdAt: str
    updatedAt: str


class ChatRequest(BaseModel):
    prompt: str
    reports: list[ChatReport]


@app.get("/")
def root():
    return {
        "message": "PaveXa API is running online",
        "status": "online",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
    }


@app.post("/api/ai/chat")
def ai_chat(request: ChatRequest):
    response = run_agent(
        prompt=request.prompt,
        reports=[
            report.model_dump()
            for report in request.reports
        ],
    )

    return {
        "response": response,
    }


app.include_router(detection_router)