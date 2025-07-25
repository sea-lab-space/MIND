import os
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
from main import run_data_prep
# ! need update
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
        "transcript": [],
        "numeric_facts": [],
    }]

    if os.path.exists(f"./generate_mock_data/context/encounters_mock_{USER_ID}.json"):
        confirm = input(f"Insight already generated for {USER_ID}. Do you want to proceed? Type 'yes' to proceed: ")
        if confirm.lower() != 'yes':
            print("Aborted.")
            exit(1)
        else:
            print("Proceeding...")

    for i in tqdm(range(1, len(DATES))):
        # 1. Determine retrospect_date and before_date
        retrospect_date = DATES[i-1]
        before_date = DATES[i]

        # 2. Initialize discoverer agents
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

        # 3. Run discoverer agents
        res = discoverer.run(data, is_testing=False)
        data_facts = res['numeric_facts']

        # 4. Append to encounters_mock
        encounters_mock.append({
            "encounter_id": i + 1,
            "retrospect_date": retrospect_date,
            "before_date": before_date,
            "transcript": [],
            "numeric_facts": data_facts
        })

        # 5. Save encounters_mock to file (to prevent network issues)
        with open(f"./generate_mock_data/context/encounters_mock_{USER_ID}.json", "w") as f:
            json.dump(encounters_mock, f, indent=2)

    print(encounters_mock[0])




