import os
import shutil
import sys, asyncio, json
from pathlib import Path
from dotenv import load_dotenv
from tqdm import tqdm

project_root = Path(__file__).parent.parent
print(project_root)
sys.path.append(str(project_root))
load_dotenv()

from discoverer.numeric_tab_data.discoverer_agents.comparison_agent import ComparisonDiscovererAgent
from discoverer.numeric_tab_data.discoverer_agents.extreme_agent import ExtremeDiscovererAgent
from discoverer.numeric_tab_data.discoverer_agents.trend_agent import TrendDiscovererAgent
from discoverer.numeric_tab_data.discoverer_agents.difference_agent import DifferenceDiscovererAgent
from utils.extract_single_feature import feature_transform
from discoverer.discoverer import Discoverer
from discoverer.numeric_tab_data.discoverer_agents.value_agent import DerivedValueDiscovererAgent
from synthesizer.synthesizer import Synthesizer
from main import run_data_prep

if __name__ == "__main__":
    USER_ID = "INS-W_963"
    MODEL_NAME = "gpt-4.1"
    data = run_data_prep(USER_ID)

    DATES = [
        '2021-03-28', # first check
        '2021-04-11', # simulate second check (2 weeks after first)
        '2021-05-09', # 6th week
        '2021-06-06', # 10th week
    ]

    encounters_mock = [{
        "encounter_id": 1,
        "retrospect_date": "",
        "before_date": DATES[0],
        "data_insights": [],
    }]

    if os.path.exists(f"./generate_mock_data/context/encounters_mock_{USER_ID}.json"):
        confirm = input(f"Insight already generated for {USER_ID}. Do you want to proceed? Type yes to proceed, yes-clean to do a full regeneration: ")
        target_folder = f"./generate_mock_data/context/{USER_ID}"
        if confirm.lower() == 'yes':
            print("Proceeding...")
            # create a folder named
            os.makedirs(
                target_folder, exist_ok=True)
        elif confirm.lower() == 'yes-clean':
            # ! delete the folder: only Windows compatible
            if os.path.exists(target_folder):
                shutil.rmtree(target_folder)
            print("Deleted existing context folder. Proceeding...")
            # create a folder
            os.makedirs(target_folder, exist_ok=True)
        else:
            print("Aborted.")
            exit(1)


    for i in tqdm(range(1, len(DATES))):
        # 1. Determine retrospect_date and before_date
        retrospect_date = DATES[i-1]
        before_date = DATES[i]

        # 2. Generate data insights (give full insight space, i.e., first two stages)
        # 2.1. Run Discoverer
        discoverer = Discoverer(
            numeric_agents=[
                TrendDiscovererAgent,
                ExtremeDiscovererAgent,
                ComparisonDiscovererAgent,
                DifferenceDiscovererAgent,
                DerivedValueDiscovererAgent,
            ],
            text_agents=[],
            retrospect_date=retrospect_date,
            before_date=before_date,
            model_name=MODEL_NAME
        )

        # check if data_facts already exsist
        # ! comment out / delete original files to override
        target_file = f"./generate_mock_data/context/{USER_ID}/encounter_{i+1}_facts.json"
        if os.path.exists(target_file):
            with open(target_file, "r") as f:
                data_facts = json.load(f)
        else:
            data_facts = discoverer.run(data, is_testing=False)
            with open(target_file, "w") as f:
                json.dump(data_facts, f, indent=2)

        # 2.2. Run Synthesizer
        synthesizer = Synthesizer(
            data_fact_source=data_facts,
            retrospect_date=retrospect_date,
            before_date=before_date,
            model_name=MODEL_NAME
        )

        # check if data_insights already exsist
        target_file = f"./generate_mock_data/context/{USER_ID}/encounter_{i+1}_insights.json"
        if os.path.exists(target_file):
            with open(target_file, "r") as f:
                data_insights_list = json.load(f)
        else:
            data_insights = synthesizer.run(iters=2)
            data_insights_list = [
                insight['insight_description'] for insight in data_insights
            ]
            with open(target_file, "w") as f:
                json.dump(data_insights_list, f, indent=2)

        print(data_insights_list)
        encounters_mock.append({
            "encounter_id": i + 1,
            "retrospect_date": retrospect_date,
            "before_date": before_date,
            "data_insights": data_insights_list,
        })
        
        # 3. Save encounters_mock to file (to prevent network issues)
        with open(f"./generate_mock_data/context/encounters_mock_{USER_ID}.json", "w") as f:
            json.dump(encounters_mock, f, indent=2)




