import os
import sys
import asyncio
import json
from pathlib import Path
from dotenv import load_dotenv
from tqdm import tqdm
import pandas as pd



project_root = Path(__file__).parent.parent
print(project_root)
sys.path.append(str(project_root))
load_dotenv()



if __name__ == "__main__":
    # read encounters_mock_INS
    with open("./generate_mock_data/context/INS-W_963_full.json", "r", encoding='utf-8') as f:
        encounters = json.load(f)

    output_path = "./generate_mock_data/context/INS-W_963_full_all_encounters.xlsx"

    with pd.ExcelWriter(output_path, engine='openpyxl') as writer:
        for encounter in encounters:
            if encounter.get('transcript'):
                df = pd.DataFrame(encounter['transcript'])
                sheet_name = f"enc_{encounter['encounter_id']}"[
                    :31]  # Excel limit: 31 chars
                df.to_excel(writer, sheet_name=sheet_name, index=False)
