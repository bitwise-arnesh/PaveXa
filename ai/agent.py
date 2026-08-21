from .ai_service import generate_response


SYSTEM_PROMPT = """
You are the PaveXa AI Agent.

Your role is to assist users with road safety, road damage detection,
road condition analysis, and maintenance-related tasks.

Be concise, helpful, and technically accurate.
"""


def run_agent(prompt: str) -> str:
    """Run the PaveXa AI agent with a user prompt."""
    full_prompt = f"{SYSTEM_PROMPT}\nUser: {prompt}"
    return generate_response(full_prompt)