from .ai_service import generate_response
from .data_service import get_road_data


SYSTEM_PROMPT = """
You are the PaveXa AI Agent.

Your role is to assist users with road safety, road damage detection,
road condition analysis, and maintenance-related tasks.

Be concise, helpful, and technically accurate.
"""


def run_agent(prompt: str) -> str:

    """Run the PaveXa AI agent with road infrastructure context."""

    road_data = get_road_data()

    road_context = "\n".join(
        f"""
Road ID: {road['road_id']}
Road Name: {road['road_name']}
Location: {road['location']}
Damage Type: {road['damage_type']}
Severity: {road['severity']}
Risk Score: {road['risk_score']}/100
Traffic Level: {road['traffic_level']}
Nearby School: {road['nearby_school']}
School Distance: {road['school_distance_m']} meters
Detected At: {road['detected_at']}
"""
        for road in road_data
    )

    full_prompt = f"""
{SYSTEM_PROMPT}

Here is the current road infrastructure data:

{road_context}

Use this data when answering questions about specific roads,
risk, severity, traffic, schools, or maintenance priorities.

Do not invent road data that is not provided.

User: {prompt}
"""

    return generate_response(full_prompt)