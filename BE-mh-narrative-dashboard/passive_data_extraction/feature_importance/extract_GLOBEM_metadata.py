from dotenv import load_dotenv
import requests
import os
from markdownify import markdownify as md

from pathlib import Path

project_root = Path(__file__).parent.parent.parent
# print(f"Project root: {project_root}")

METADATA_DICT = {
    # "surveys": [
    #     'ema'
    # ],
    "sensors": [
        'location',
        'phoneusage',
        'call',
        'bluetooth',
        'wifi',
        'physicalactivity',
        'sleep'
    ]
}

def get_feature_metadata():
    headers = {
        'Authorization': f'Bearer {JINA_KEY}',
        "X-Target-Selector": r'#__next > div > div.max-w-\[90rem\].w-full.mx-auto.flex.flex-1.items-stretch > div > article > main > table',
        'X-Return-Format': 'html'
    }

    for key, value in METADATA_DICT.items():
        for v in value:
            response = requests.get(
                f'https://r.jina.ai/https://the-globem.github.io/datasets/datatypes/{key}/{v}', headers=headers)
            markdown_tabel = md(response.text)
            with open(os.path.join(project_root, f'passive_data_extraction/feature_importance/feature_description/{v}.md'), 'w', encoding='utf-8') as f:
                f.write(markdown_tabel)

if __name__ == "__main__":
    load_dotenv()
    JINA_KEY = os.environ.get("JINA_API_KEY")
    # get_feature_metadata()
    pass
