import sys, asyncio
from pathlib import Path
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
    feature_list = feature_transform('INS-W_963')

    RETROSPECT_DATE = "2021-04-22"
    BEFORE_DATE = "2021-05-31"

    discoverers = [
        DifferenceDiscovererAgent(
            RETROSPECT_DATE,
            BEFORE_DATE,
            model='gpt-4.1-mini'
        ),
        # ComparisonDiscovererAgent(
        #     RETROSPECT_DATE,
        #     BEFORE_DATE,
        #     model='gpt-4.1-mini'
        # ),
        # ExtremeDiscovererAgent(
        #     RETROSPECT_DATE,
        #     BEFORE_DATE,
        #     # model='gpt-4.1-mini'
        # ),
        # TrendDiscovererAgent(
        #     RETROSPECT_DATE,
        #     BEFORE_DATE,
        #     # model='gpt-4.1-mini'
        # ),
    ]

    for discoverer in discoverers:
        for feature in feature_list:
            # print(feature)
            asyncio.run(discoverer.run(feature, verbose=True))
            break
