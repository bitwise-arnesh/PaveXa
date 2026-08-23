from io import BytesIO
from pathlib import Path

from fastapi import UploadFile
from PIL import Image
from ultralytics import YOLO

from server.app.risk_engine.yolo_adapter import convert_yolo_detections


MODEL_PATH = (
    Path(__file__).resolve().parents[3]
    / "ai"
    / "models"
    / "PaveXa_model.pt"
)

model = YOLO(str(MODEL_PATH))


async def detect_damage(image: UploadFile) -> dict:
    contents = await image.read()

    pil_image = Image.open(BytesIO(contents)).convert("RGB")

    results = model(pil_image)

    detections = convert_yolo_detections(results)

    return {
        "detections": detections
    }