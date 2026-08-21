import os
from pathlib import Path

from dotenv import load_dotenv
from groq import Groq


load_dotenv(Path(__file__).with_name(".env"))


client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)