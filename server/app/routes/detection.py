from fastapi import APIRouter, File, UploadFile

from app.services.cv_service import detect_damage as run_cv_detection


router = APIRouter(
    prefix="/api",
    tags=["Detection"]
)


@router.post("/detect")
async def detect_damage(
    image: UploadFile = File(...)
):
    cv_result = await run_cv_detection(image)

    return {
        "message": "Image analyzed successfully",
        "filename": image.filename,
        "detections": cv_result["detections"]
    }