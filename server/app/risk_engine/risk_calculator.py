from .severity import get_damage_severity
from .rules import WEIGHTS


def get_risk_level(score):
    if score <= 30:
        return "Low"

    elif score <= 60:
        return "Medium"

    elif score <= 80:
        return "High"

    else:
        return "Critical"


def calculate_risk(data):

    detections = data["detections"]

    # 1. Damage Severity
    if detections:
        severities = [
            get_damage_severity(damage["type"])
            for damage in detections
        ]

        avg_severity = sum(severities) / len(severities)
    else:
        avg_severity = 0

    damage_severity_score = (
        avg_severity * WEIGHTS["damage_severity"]
    )

    # 2. Damage Density
    damage_count = len(detections)

    damage_density = min(damage_count / 10, 1)

    damage_density_score = (
        damage_density * WEIGHTS["damage_density"]
    )

    # 3. Traffic Density
    traffic_density = data.get("traffic_density", 0)

    traffic_score = (
        traffic_density * WEIGHTS["traffic_density"]
    )

    # 4. Road Importance
    road_importance = data.get("road_importance", 0)

    road_score = (
        road_importance * WEIGHTS["road_importance"]
    )

    # 5. Pedestrian Risk
    pedestrian_risk = data.get("pedestrian_risk", 0)

    pedestrian_score = (
        pedestrian_risk * WEIGHTS["pedestrian_risk"]
    )

    # 6. Infrastructure Risk
    infrastructure_risk = data.get(
        "infrastructure_risk",
        0
    )

    infrastructure_score = (
        infrastructure_risk
        * WEIGHTS["infrastructure_risk"]
    )

    # Final Risk Score
    score = (
        damage_severity_score
        + damage_density_score
        + traffic_score
        + road_score
        + pedestrian_score
        + infrastructure_score
    )

    score = round(min(score, 100), 2)

    # Risk Level
    risk_level = get_risk_level(score)

    # Score Breakdown
    breakdown = {
        "damage_severity": round(damage_severity_score, 2),
        "damage_density": round(damage_density_score, 2),
        "traffic_density": round(traffic_score, 2),
        "road_importance": round(road_score, 2),
        "pedestrian_risk": round(pedestrian_score, 2),
        "infrastructure_risk": round(infrastructure_score, 2),
    }

    return {
        "risk_score": score,
        "risk_level": risk_level,
        "breakdown": breakdown
    }