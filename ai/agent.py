from typing import Any

from .ai_service import generate_response


SYSTEM_PROMPT = """
You are the PaveXa AI Assistant for administrators.

PaveXa is an intelligent road infrastructure and maintenance platform.

Your job is to help administrators analyze REAL infrastructure reports
provided in the current request.

You can answer questions about:
- infrastructure reports
- report IDs
- road damage types
- risk scores
- risk levels
- AI confidence
- infrastructure risk
- report status
- active and resolved reports
- report locations
- report descriptions
- report submission dates
- maintenance priorities
- comparisons between reports
- overall report statistics

IMPORTANT RULES:

1. Use ONLY the report data provided to you.
2. Never invent a report, location, risk score, status, or statistic.
3. If the provided data does not contain enough information to answer,
   clearly say that the available report data is insufficient.
4. Do not treat a report ID as a road name.
5. Report IDs are the identifiers stored in the PaveXa database.
6. RESOLVED reports are still valid historical reports, but they are no
   longer active maintenance issues.
7. When discussing priority, consider the actual riskScore and riskLevel
   present in the provided data.
8. Keep answers concise but explain the reasoning when useful.
9. Use exact values from the provided data whenever possible.
10. Do not claim that you performed an action such as changing a report
    status. This assistant is read-only.

You are assisting an administrator, so answer professionally and directly.
"""


def _format_report(report: dict[str, Any]) -> str:
    """
    Convert one database report into readable context for the AI.
    """

    return f"""
Report ID: {report.get("id")}
Latitude: {report.get("latitude")}
Longitude: {report.get("longitude")}
Damage Type: {report.get("damageType")}
Confidence: {report.get("confidence")}
Risk Score: {report.get("riskScore")}/100
Risk Level: {report.get("riskLevel")}
Infrastructure Risk: {report.get("infrastructureRisk")}
Status: {report.get("status")}
Description: {report.get("description")}
Created At: {report.get("createdAt")}
Updated At: {report.get("updatedAt")}
Infrastructure Data: {report.get("infrastructureData")}
"""


def run_agent(
    prompt: str,
    reports: list[dict[str, Any]],
) -> str:
    """
    Run the PaveXa AI assistant using real report data supplied
    by the Next.js application.
    """

    if not reports:
        report_context = "There are currently no reports in the database."
    else:
        report_context = "\n".join(
            _format_report(item)
            for item in reports
        )

    full_prompt = f"""
{SYSTEM_PROMPT}

CURRENT PAVEXA REPORT DATA
==========================

{report_context}

END OF REPORT DATA
==================

Administrator question:

{prompt}
"""

    return generate_response(full_prompt)