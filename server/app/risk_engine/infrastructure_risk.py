from typing import Any


def calculate_infrastructure_risk(
    gis_result: dict[str, Any],
) -> float:
    if not gis_result or gis_result.get("available") is False:
        return 0.0

    counts = gis_result.get("counts", {})
    score = 0.0

    score += min(counts.get("schools", 0) * 0.15, 0.30)
    score += min(counts.get("hospitals", 0) * 0.15, 0.30)
    score += min(counts.get("clinics", 0) * 0.08, 0.16)
    score += min(counts.get("fire_stations", 0) * 0.08, 0.16)
    score += min(counts.get("police_stations", 0) * 0.08, 0.16)
    score += min(counts.get("bus_stops", 0) * 0.06, 0.24)
    score += min(counts.get("railway_stations", 0) * 0.10, 0.20)
    score += min(counts.get("traffic_signals", 0) * 0.06, 0.12)
    score += min(counts.get("crossings", 0) * 0.06, 0.12)
    score += min(counts.get("major_roads", 0) * 0.02, 0.12)

    nearby = gis_result.get("nearby", [])
    nearest_bonus = 0.0

    high_impact = {
        "school",
        "hospital",
        "clinic",
        "bus_stop",
        "crossing",
        "railway_station",
    }

    for item in nearby:
        distance = item.get("distance_m")
        infrastructure_type = item.get("type")

        if distance is None:
            continue

        if distance <= 50:
            if infrastructure_type in high_impact:
                nearest_bonus += 0.12
            elif infrastructure_type == "major_road":
                nearest_bonus += 0.05

        elif distance <= 100:
            if infrastructure_type in high_impact:
                nearest_bonus += 0.08
            elif infrastructure_type == "major_road":
                nearest_bonus += 0.03

        elif distance <= 250:
            if infrastructure_type in high_impact:
                nearest_bonus += 0.04

    score += min(nearest_bonus, 0.30)

    return round(min(score, 1.0), 3)