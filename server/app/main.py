from fastapi import FastAPI
from pydantic import BaseModel

from ai.agent import run_agent


app = FastAPI(
    title="PaveXa API",
    description="Intelligent Road Infrastructure & Maintenance Platform",
    version="1.0.0"
)


class ChatRequest(BaseModel):
    prompt: str


@app.get("/")
def root():
    return {
        "message": "PaveXa API is running online",
        "status": "online"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.post("/api/ai/chat")
def ai_chat(request: ChatRequest):
    response = run_agent(request.prompt)

    return {
        "response": response
    }