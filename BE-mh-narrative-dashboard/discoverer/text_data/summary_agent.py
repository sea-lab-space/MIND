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

if __name__ == "__main__":
    # load generate_mock_data/context/INS-W_963.json
    with open("./generate_mock_data/context/INS-W_963_full.json", "r") as f:
        data = json.load(f)

    notes = {}
    for datum in data:
        notes[datum["before_date"]] = datum['clinical_note']

    agent = NotesDiscovererAgent(
        before_date="2021-06-06",
        retrospect_date="2021-05-09",
        model="gpt-4.1-nano")
    print(agent.modality_source)
    res = asyncio.run(agent.run(notes, verbose=True))
    # print(res)