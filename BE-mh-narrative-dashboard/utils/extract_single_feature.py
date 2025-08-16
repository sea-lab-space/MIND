from typing import Dict, List, Literal
import pandas as pd
from pathlib import Path
import sys, os
from pydantic import BaseModel

from utils.search import replace_NaNs_to_null

project_root = Path(__file__).parent.parent
# print(f"Project root: {project_root}")
sys.path.append(str(project_root))

from kb.defs import NUMERICAL_FEATURE_KB

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

        if "survey" in file:
            feature_type = "survey"
            feature_source = "survey"
        else:
            feature_type = "passive sensing"
            feature_source = file.split('_')[2]
        
        # some features categories (e.g., wifi) might get discarded based on the KB
        if feature_source not in NUMERICAL_FEATURE_KB:
            continue

        for col in usable_columns:
            # if len(prompt_data) != 70: # 10 weeks
            #     print(col)
            # some feature items (e.g., wake count) might get discarded based on the KB
            if col not in NUMERICAL_FEATURE_KB[feature_source]:
                continue

            prompt_data = df[[date_col_name, col]]
            # rename col
            col_name_new = NUMERICAL_FEATURE_KB[feature_source][col]['rename']
            prompt_data.columns = ['date', col_name_new]

            # unit translate
            original_unit, target_unit = NUMERICAL_FEATURE_KB[feature_source][col]['unit'], NUMERICAL_FEATURE_KB[feature_source][col]['target_unit']
            if original_unit == 'meters' and target_unit == 'miles':
                prompt_data = meters_to_miles(prompt_data, col_name_new)
            elif original_unit == 'minutes' and target_unit == 'hours':
                prompt_data = minutes_to_hours(prompt_data, col_name_new)
            elif original_unit == None and target_unit == None and col == "circdnrtn":
                prompt_data = coefficient_to_percent(prompt_data, col_name_new)

            # translate value
            if col == "firstbedtimemain":
                prompt_data = normalize_24_hours(prompt_data, col_name_new)
            if col == "negative_affect_EMA" or col == "positive_affect_EMA":
                prompt_data = plus_5(prompt_data, col_name_new)

            prompt_data = round_vals(prompt_data, col_name_new)

            feature_list.append(
                {
                    'modality_type': feature_type,
                    'modality_source': feature_source,
                    'feature_name_renamed': col_name_new,
                    'feature_name': col,
                    'data': replace_NaNs_to_null(prompt_data.to_dict(orient='records')),
                }
            )
    return feature_list


def meters_to_miles(df: pd.DataFrame, col_name: str) -> pd.DataFrame:
    """Converts a column of meter values to miles and rounds to two decimal places."""
    # Use .loc to avoid the SettingWithCopyWarning
    df.loc[:, col_name] = round(df[col_name] * 0.000621371, 2)
    return df


def minutes_to_hours(df: pd.DataFrame, col_name: str) -> pd.DataFrame:
    """Converts a column of minute values to hours and rounds to two decimal places."""
    # Use .loc to avoid the SettingWithCopyWarning
    df.loc[:, col_name] = round(df[col_name] / 60, 2)
    return df

def coefficient_to_percent(df, col_name):
    df.loc[:, col_name] = df[col_name] * 100
    return df

def normalize_24_hours(df, col_name):
    df.loc[:, col_name] = df[col_name] - 24
    return df

def round_vals(df, col_name):
    df.loc[:, col_name] = round(df[col_name], 2)
    return df

def plus_5(df, col_name):
    df.loc[:, col_name] = df[col_name] + 5
    return df


if __name__ == '__main__':
    feat_963 = feature_transform('INS-W_963')
    feat_1044 = feature_transform('INS-W_1044')
    feat_1077 = feature_transform('INS-W_1077')
    print(feat_963)
