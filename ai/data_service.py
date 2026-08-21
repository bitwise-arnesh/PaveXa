import json
from pathlib import Path


DATA_FILE = Path(__file__).parent / "mock_data.json"


def get_road_data():
    """Load road infrastructure data from the temporary mock JSON file."""

    with open(DATA_FILE, "r", encoding="utf-8") as file:
        return json.load(file)