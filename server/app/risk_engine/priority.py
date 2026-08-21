from .risk_calculator import calculate_risk


def get_critical_priorities(incidents, min_score=70, limit=5):
    """
    Calculate risk for all incidents and return the
    highest-priority incidents first.

    Parameters:
        incidents (list): List of incident dictionaries.
        min_score (float): Minimum risk score to be considered
                           a priority incident.
        limit (int): Maximum number of incidents to return.

    Returns:
        list: Ranked priority incidents.
    """

    scored_incidents = []

    for incident in incidents:
        risk_result = calculate_risk(incident)

        risk_score = risk_result["risk_score"]
        risk_level = risk_result["risk_level"]

        if risk_score >= min_score:
            scored_incidents.append({
                "incident": incident,
                "risk_score": risk_score,
                "risk_level": risk_level
            })

    # Highest-risk incidents first
    scored_incidents.sort(
        key=lambda item: item["risk_score"],
        reverse=True
    )

    # Add priority rank
    for index, item in enumerate(scored_incidents[:limit], start=1):
        item["priority_rank"] = index

    return scored_incidents[:limit]