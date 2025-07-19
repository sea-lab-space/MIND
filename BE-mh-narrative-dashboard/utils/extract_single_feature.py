from typing import Dict, List, Literal
import pandas as pd
from pathlib import Path
import sys, os

from pydantic import BaseModel

project_root = Path(__file__).parent.parent
# print(f"Project root: {project_root}")
sys.path.append(str(project_root))

class FeatureInputType(BaseModel):
    modality_type: Literal['passive sensing', 'survey']
    modality_source: str
    feature_name: str
    data: List[Dict]


def feature_transform(pid: str, granularity: Literal['finest', 'allday'] = 'allday') -> List[FeatureInputType]:
    directory = f'{project_root}/data/'
    # list directories
    files = os.listdir(directory)
    # usable files
    usable_files = [f for f in files if (granularity in f or 'survey' in f) and f.endswith('.csv')]
    feature_list = []
    for file in usable_files:
        df = pd.read_csv(directory + file)
        # filter only this pid
        df = df[df['pid'] == pid]

        usable_columns = set(df.columns) - set(['pid', 'date', 'segment', 'datetime'])
        if granularity != 'allday':
            date_col_name = 'datetime'
        else:
            date_col_name = 'date'

        for col in usable_columns:
            prompt_data = df[[date_col_name, col]]
            # if len(prompt_data) != 70: # 10 weeks
            #     print(col)
            if "survey" in file:
                feature_type = "survey"
                feature_source = "survey"
            else:
                feature_type = "passive sensing"
                feature_source = file.split('_')[2]
            feature_list.append(
                {
                    'modality_type': feature_type,
                    'modality_source': feature_source,
                    'feature_name': col,
                    'data': prompt_data.to_dict(orient='records'),
                }
            )
    return feature_list


if __name__ == '__main__':
    feat_963 = feature_transform('INS-W_963')
    feat_1044 = feature_transform('INS-W_1044')
    feat_1077 = feature_transform('INS-W_1077')
    print(feat_963)
