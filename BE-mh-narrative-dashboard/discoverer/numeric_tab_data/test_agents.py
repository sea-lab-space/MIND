import sys, asyncio
from pathlib import Path
from dotenv import load_dotenv
project_root = Path(__file__).parent.parent.parent
print(project_root)
sys.path.append(str(project_root))
load_dotenv()
from discoverer.numeric_tab_data.discoverer_agents.extreme_agent import ExtremeDiscovererAgent
from utils.extract_single_feature import feature_transform


if __name__ == "__main__":
    feature_list = feature_transform('INS-W_963')

    discoverers = [ExtremeDiscovererAgent("2021-04-22")]

    for discoverer in discoverers:
        for feature in feature_list:
            asyncio.run(discoverer.run(feature, verbose=True))
            break
