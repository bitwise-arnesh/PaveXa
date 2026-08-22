from .infrastructure_risk import calculate_infrastructure_risk
from .report_density import calculate_report_density_risk


def calculate_risk(
    gis_result: dict,
    report_count: int,
) -> dict:
    infrastructure_risk = calculate_infrastructure_risk(
        gis_result
    )

    report_density_risk = calculate_report_density_risk(
        report_count
    )

    risk_score = round(
        infrastructure_risk * 70
        + report_density_risk * 30
    )

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
            "infrastructure_risk": round(
                infrastructure_risk * 70,
                2,
            ),
            "report_density": round(
                report_density_risk * 30,
                2,
            ),
        },
        "infrastructure_risk": infrastructure_risk,
        "report_density_risk": report_density_risk,
        "nearby_report_count": report_count,
    }