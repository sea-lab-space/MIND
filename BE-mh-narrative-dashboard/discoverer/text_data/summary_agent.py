import sys
import asyncio
import json
from pathlib import Path
from dotenv import load_dotenv

project_root = Path(__file__).parent.parent.parent
print(project_root)
sys.path.append(str(project_root))
load_dotenv()

from discoverer.text_data.base_text_agent import BaseTextDiscovererAgent
class NotesDiscovererAgent(BaseTextDiscovererAgent):
    def __init__(self, retrospect_date: str, before_date: str, model: str):
        super().__init__(
            modality_source="clinical note",
            retrospect_date=retrospect_date,
            before_date=before_date,
            model=model
        )
class TranscriptsDiscovererAgent(BaseTextDiscovererAgent):
    def __init__(self, retrospect_date: str, before_date: str, model: str):
        super().__init__(
            modality_source="clinical transcript",
            retrospect_date=retrospect_date,
            before_date=before_date,
            model=model
        )