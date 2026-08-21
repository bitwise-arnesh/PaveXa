from fastapi import UploadFile


async def detect_damage(image: UploadFile) -> dict:
    """
    actual YOLOv8/RDD2022 CV service.
    """

    return {
        "detections": [
            {
                "type": "pothole",
                "confidence": 0.91,
                "bbox": [120, 180, 430, 390]
            }
        ]
    }