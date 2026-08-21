from fastapi import FastAPI

app = FastAPI(
    title="PaveXa API",
    description="Intelligent Road Infrastructure & Maintenance Platform",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "PaveXa API is running",
        "status": "online"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }