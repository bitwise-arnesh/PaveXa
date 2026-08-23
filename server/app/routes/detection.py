from fastapi import APIRouter, File, UploadFile, Form

from server.app.services.cv_service import detect_damage as run_cv_detection
from server.app.services.gis_service import get_nearby_infrastructure
from server.app.risk_engine.risk_calculator import calculate_risk


router = APIRouter(
    prefix="/api",
    tags=["Detection"],
)


@router.post("/detect")
async def detect_damage(
    image: UploadFile = File(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    report_count: int = Form(0),
):
    print("\nROAD DAMAGE ANALYSIS")
    print(f"Location: {latitude}, {longitude}")
    print(f"Previous reports: {report_count}")

    # --------------------------------------------------
    # 1. RUN COMPUTER VISION DETECTION
    # --------------------------------------------------

    cv_result = await run_cv_detection(image)

    detections = cv_result.get(
        "detections",
        [],
    )

    # --------------------------------------------------
    # 2. NO DAMAGE DETECTED
    # --------------------------------------------------

    if not detections:
        return {
            "message": "No road damage detected",
            "filename": image.filename,

            "location": {
                "latitude": latitude,
                "longitude": longitude,
            },

            "detections": [],

            "risk": {
                "risk_score": 0,
                "risk_level": "LOW",

                "breakdown": {
                    "damage_risk": 0,
                    "infrastructure_risk": 0,
                    "report_density": 0,
                },

                "damage_risk": 0,
                "infrastructure_risk": 0,
                "report_density_risk": 0,

                "nearby_report_count": report_count,
            },

            "gis": {
                "available": False,
                "radius": 500,
                "counts": {},
                "nearest": {},
                "nearby": [],
            },
        }

    # --------------------------------------------------
    # 3. GET GIS / INFRASTRUCTURE DATA
    # --------------------------------------------------

    gis_result = await get_nearby_infrastructure(
        latitude=latitude,
        longitude=longitude,
        radius=500,
    )

    # --------------------------------------------------
    # 4. SELECT PRIMARY DETECTION
    # --------------------------------------------------
    # If multiple damages are detected, use the one
    # with the highest AI confidence for risk calculation.

    primary_detection = max(
        detections,
        key=lambda item: float(
            item.get("confidence", 0)
        ),
    )

    damage_type = primary_detection.get(
        "type",
        "unknown",
    )

    damage_confidence = float(
        primary_detection.get(
            "confidence",
            0,
        )
    )

    # --------------------------------------------------
    # 5. CALCULATE RISK
    # --------------------------------------------------

    risk_result = calculate_risk(
        gis_result=gis_result,
        report_count=report_count,
        damage_type=damage_type,
        confidence=damage_confidence,
    )

    # --------------------------------------------------
    # 6. LOG RESULTS
    # --------------------------------------------------

    print(
        "Infrastructure:",
        gis_result.get(
            "counts",
            {},
        ),
    )

    print(
        "Previous reports:",
        report_count,
    )

    print(
        "Primary damage:",
        damage_type,
    )

    print(
        "AI confidence:",
        damage_confidence,
    )

    print(
        "Risk:",
        risk_result,
    )

    # --------------------------------------------------
    # 7. RETURN COMPLETE ANALYSIS
    # --------------------------------------------------

    return {
        "message": "Image analyzed successfully",

        "filename": image.filename,

        "location": {
            "latitude": latitude,
            "longitude": longitude,
        },

        "detections": detections,

        "risk": risk_result,

        "gis": {
            "available": gis_result.get(
                "available",
                False,
            ),

            "radius": gis_result.get(
                "radius",
                500,
            ),

            "counts": gis_result.get(
                "counts",
                {},
            ),

            "nearest": gis_result.get(
                "nearest",
                {},
            ),

            "nearby": gis_result.get(
                "nearby",
                [],
            ),
        },
    }