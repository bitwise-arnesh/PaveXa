from ai_service import generate_response


def run_agent(prompt: str) -> str:
    """Run the PaveXa AI agent with a user prompt."""
    return generate_response(prompt)