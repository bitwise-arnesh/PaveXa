from .infrastructure_risk import calculate_infrastructure_risk
from .report_density import calculate_report_density_risk


DAMAGE_SEVERITY = {
    "pothole": 0.70,
    "potholes": 0.70,

    "crack": 0.45,
    "cracks": 0.45,

    "road_crack": 0.45,

    "damaged_road": 0.65,
    "road_damage": 0.65,

    "broken_road": 0.75,
    "road_break": 0.75,

    "flooded_road": 0.70,
    "waterlogging": 0.70,

    "debris": 0.55,

    "default": 0.50,
}


def calculate_damage_risk(
    damage_type: str,
    confidence: float,
) -> float:
    """
    Calculate the base risk caused by the detected
    road damage itself.

    Damage severity contributes 60% of the final score.
    AI confidence adjusts how strongly the detection
    should influence the risk.
    """

    damage_key = (
        damage_type
        .strip()
        .lower()
        .replace(" ", "_")
        .replace("-", "_")
    )

    severity = DAMAGE_SEVERITY.get(
        damage_key,
        DAMAGE_SEVERITY["default"],
    )

    confidence = max(
        0.0,
        min(float(confidence), 1.0),
    )

    # Confidence ranges from 0 -> 1.
    # We keep at least 50% of the severity even when
    # confidence is relatively low.
    confidence_factor = 0.5 + (confidence * 0.5)

    return round(
        min(severity * confidence_factor, 1.0),
        3,
    )


def calculate_risk(
    gis_result: dict,
    report_count: int,
    damage_type: str,
    confidence: float,
) -> dict:

    # --------------------------------------------------
    # 1. DAMAGE RISK — 60%
    # --------------------------------------------------

    damage_risk = calculate_damage_risk(
        damage_type=damage_type,
        confidence=confidence,
    )

    # --------------------------------------------------
    # 2. INFRASTRUCTURE RISK — 25%
    # --------------------------------------------------

    infrastructure_risk = calculate_infrastructure_risk(
        gis_result
    )

    # --------------------------------------------------
    # 3. REPORT DENSITY RISK — 15%
    # --------------------------------------------------

    report_density_risk = calculate_report_density_risk(
        report_count
    )

    # --------------------------------------------------
    # FINAL SCORE
    # --------------------------------------------------

    damage_component = damage_risk * 60
    infrastructure_component = infrastructure_risk * 25
    report_density_component = report_density_risk * 15

    risk_score = round(
        damage_component
        + infrastructure_component
        + report_density_component
    )

    # Keep score inside 0-100.
    risk_score = max(
        0,
        min(risk_score, 100),
    )

    # --------------------------------------------------
    # RISK LEVEL
    # --------------------------------------------------

    if risk_score >= 75:
        risk_level = "CRITICAL"

    elif risk_score >= 50:
        risk_level = "HIGH"

    elif risk_score >= 25:
        risk_level = "MEDIUM"

    else:
        risk_level = "LOW"

    return {
        "risk_score": risk_score,
        "risk_level": risk_level,

        "breakdown": {
            "damage_risk": round(
                damage_component,
                2,
            ),

            "infrastructure_risk": round(
                infrastructure_component,
                2,
            ),

            "report_density": round(
                report_density_component,
                2,
            ),
        },

        "damage_risk": damage_risk,

        "infrastructure_risk": infrastructure_risk,

        "report_density_risk": report_density_risk,

        "nearby_report_count": report_count,

        "damage_type": damage_type,

        "confidence": confidence,
    }