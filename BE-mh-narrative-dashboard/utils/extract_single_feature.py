from typing import Literal
import pandas as pd
from pathlib import Path
import sys, os

project_root = Path(__file__).parent.parent
# print(f"Project root: {project_root}")
sys.path.append(str(project_root))


def feature_transform(pid: str, granularity: Literal['finest', 'allday'] = 'allday'):
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
            feature_list.append(
                {
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
