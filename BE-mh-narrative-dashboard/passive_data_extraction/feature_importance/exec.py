import os
from pathlib import Path
import sys
import json
from tqdm import tqdm

from dotenv import load_dotenv
from pydantic import TypeAdapter
project_root = Path(__file__).parent.parent.parent
# print(f"Project root: {project_root}")
sys.path.append(str(project_root))

from passive_data_extraction.feature_importance.extract_GLOBEM_metadata import METADATA_DICT, get_feature_metadata
from passive_data_extraction.feature_importance.prompt_roleplay import ROLEPLAY_PROMPT, DE_TASK_PROMPT, DE_Formatting
import openai

def automatic_rating():
    load_dotenv()
    openai.api_key = os.getenv("OPENAI_API_KEY")
    client = openai.OpenAI()

    for key, value in METADATA_DICT.items():
        for val in tqdm(value):
            # read md file in raw text
            with open(f"passive_data_extraction/feature_importance/feature_description/{val}.md", "r") as f:
                feature_description = f.read()
                f.close()
            prompt = f'''
                {ROLEPLAY_PROMPT}
                {DE_TASK_PROMPT}

                Below are features for {val} in the format of markdown tables:
                {feature_description}
                '''
            response = client.responses.parse(
                model="gpt-4.1",
                input=[
                    {"role": "system", "content": prompt}
                ],
                text_format=DE_Formatting,
                temperature=0
            )
            event = response.output_parsed
            # pydantic to dict
            event_dict = event.model_dump()
            # save to json file
            with open(f"passive_data_extraction/feature_importance/importance/{val}.json", "w") as f:
                json.dump(event_dict, f, indent=2)
                f.close()


if __name__ == '__main__':
    # get_feature_metadata()
    automatic_rating()

    # process importance scores

    usable_features = {}
    for key, value in METADATA_DICT.items():
        for val in tqdm(value):
            with open(f"passive_data_extraction/feature_importance/importance/{val}.json", "r") as f:
                features = json.load(f)['response']
                f.close()
            # sort by rank, descending
            features = sorted(features, key=lambda x: x['rank'], reverse=True)
            # filter out features with scores less or equal than 4
            features = [feature for feature in features if feature['rank'] > 4]
            usable_features[val] = [featName['feature_name'] for featName in features]
            
    print(usable_features)
    # store in json
    with open("passive_data_extraction/feature_importance/usable_features.json", "w") as f:
        json.dump(usable_features, f, indent=2)
        f.close()

