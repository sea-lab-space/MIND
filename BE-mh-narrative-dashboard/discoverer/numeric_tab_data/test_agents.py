import sys, asyncio, json
from pathlib import Path
from typing import TypedDict
from agents import function_tool
from dotenv import load_dotenv

project_root = Path(__file__).parent.parent.parent
print(project_root)
sys.path.append(str(project_root))
load_dotenv()
from discoverer.numeric_tab_data.discoverer_agents.comparison_agent import ComparisonDiscovererAgent
from discoverer.numeric_tab_data.discoverer_agents.extreme_agent import ExtremeDiscovererAgent
from discoverer.numeric_tab_data.discoverer_agents.trend_agent import TrendDiscovererAgent
from discoverer.numeric_tab_data.discoverer_agents.difference_agent import DifferenceDiscovererAgent
from utils.extract_single_feature import feature_transform

if __name__ == "__main__":
    USER_ID = "INS-W_963"
    MODEL_NAME = "gpt-4.1-nano"
    feature_list = feature_transform(USER_ID)

    DATES = [
        '2021-03-28', # first check
        '2021-04-11', # simulate second check (2 weeks after first)
        '2021-05-09', # 6th week
        '2021-06-06', # 10th week
    ]

    encounters_mock = [{
        "encounter_id": 0,
        "retrospect_date": "",
        "before_date": DATES[0],
        "transcript": [],
        "data_facts": [],
    }]

    for i in range(1, len(DATES)):
        # 1. Determine retrospect_date and before_date
        retrospect_date = DATES[i-1]
        before_date = DATES[i]

        # 2. Initialize discoverer agents
        discoverers = [
            DifferenceDiscovererAgent(
                retrospect_date,
                before_date,
                model=MODEL_NAME
            ),
            ComparisonDiscovererAgent(
                retrospect_date,
                before_date,
                model=MODEL_NAME
            ),
            ExtremeDiscovererAgent(
                retrospect_date,
                before_date,
                model=MODEL_NAME
            ),
            TrendDiscovererAgent(
                retrospect_date,
                before_date,
                model=MODEL_NAME
            ),
        ]

        # 3. Run discoverer agents
        data_facts = []
        # TODO: remove :5 (test with only 5 features)
        for feature in feature_list[:5]:
            for discoverer in discoverers:
                # print(feature)
                data_fact = asyncio.run(discoverer.run(feature, verbose=True))
                if data_fact:
                    data_facts.append({
                        "modality_type": feature['modality_type'],
                        "modality_source": feature['modality_source'],
                        "feature_name": feature['feature_name'],
                        "data_fact": data_fact
                    })

        # 4. Append to encounters_mock
        encounters_mock.append({
            "encounter_id": i + 1,
            "retrospect_date": retrospect_date,
            "before_date": before_date,
            "transcript": [],
            "data_facts": data_facts,
        })

        # 5. Save encounters_mock to file (to prevent network issues)
        with open(f"encounters_mock_{USER_ID}.json", "w") as f:
            json.dump(encounters_mock, f, indent=2)
    print(encounters_mock[0])




