def calculate_report_density_risk(
    report_count: int,
) -> float:
    if report_count <= 0:
        return 0.0

    return min(report_count * 0.10, 1.0)