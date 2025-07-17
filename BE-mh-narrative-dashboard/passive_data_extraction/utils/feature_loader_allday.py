from utils.date_filter import DATE_RANGE, filter_dates
from copy import deepcopy
import os
import pandas as pd

import sys
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)


TIME_KEYWORDS = [":allday"]

SEGMENT_TO_TIME = {
    'allday': '12:00:00'  # Noon — representative time for allday
}


class PassiveFeatureLoaderAllDay:
    def __init__(self, setName: str, featureName: str, includeFeatures: list, filterPID: list = None, interpolate: bool = True):
        self.setName = setName
        self.featureName = featureName
        self.include_features = includeFeatures
        self.directory = os.path.join(
            project_root, "data_raw", "INS-W_" + setName, "FeatureData", featureName + ".csv")
        self.data_raw = filter_dates(
            self._load_csv(filterPID),
            DATE_RANGE[int(setName)]['start'],
            DATE_RANGE[int(setName)]['end']
        )
        self.data_filtered = self._filter_data(self.data_raw)
        self.data_long = self._process_data_long_form(
            self.data_filtered, interpolate)

    def _load_csv(self, filterPID=None):
        df = pd.read_csv(self.directory, low_memory=False)
        return df[df['pid'].isin(filterPID)] if filterPID else df

    def _filter_data(self, df_i):
        df = deepcopy(df_i)
        df = self._exclude_features(df)
        df = self._include_features(df)
        return df

    def _process_data_long_form(self, df_i, interpolate: bool):
        df = deepcopy(df_i)
        df = self._pivot_features(df)
        df = self._attach_datetime(df)
        if interpolate:
            df = self._interpolate_MAR(df)
        return df

    def _interpolate_MAR(self, df):
        df = df.sort_values(['pid', 'datetime'])
        df = df.set_index('datetime')
        df[self.include_features] = df.groupby(['pid', 'segment'])[self.include_features].transform(
            lambda x: x.interpolate(method='time', limit_direction='both')
        )
        return df.reset_index()

    def _pivot_features(self, df):
        melted_data = df.melt(
            id_vars=["pid", "date"],
            value_vars=[col for col in df.columns if any(
                metric in col for metric in self.include_features)],
            var_name="variable",
            value_name="value"
        )

        melted_data['segment'] = None
        for time_segment in SEGMENT_TO_TIME.keys():
            time_suffix = ":" + time_segment
            mask = melted_data['variable'].str.endswith(time_suffix)
            melted_data.loc[mask, 'segment'] = time_segment
            melted_data.loc[mask, 'metric'] = melted_data.loc[mask,
                                                              'variable'].str[:-len(time_suffix)]

        pivoted_data = melted_data.pivot_table(
            index=["pid", "date", "segment"],
            columns="metric",
            values="value",
            aggfunc='first',
            dropna=False
        ).reset_index()

        rename = {}
        for col in pivoted_data.columns:
            parts = col.split(':')
            if len(parts) >= 2:
                feature_part = parts[1]
                feature_name_split = feature_part.split("_")
                feature_name_after = ["rapids", "doryab", "barnett", "locmap"]
                actual_name_split = []
                flag = False
                for feature_split in feature_name_split:
                    if flag:
                        actual_name_split.append(feature_split)
                    if feature_split in feature_name_after:
                        flag = True
                actual_name = "_".join(actual_name_split)
                if actual_name in self.include_features:
                    rename[col] = actual_name
                else:
                    pivoted_data = pivoted_data.drop(columns=[col])
            else:
                rename[col] = col

        pivoted_data = pivoted_data.rename(columns=rename)
        return pivoted_data

    def _get_usable_feature_name(self, col):
        parts = col.split(':')
        if len(parts) >= 2:
            feature_part = parts[1]
            feature_name_split = feature_part.split("_")
            feature_name_after = ["rapids", "doryab", "barnett", "locmap"]
            actual_name_split = []
            flag = False
            for feature_split in feature_name_split:
                if flag:
                    actual_name_split.append(feature_split)
                if feature_split in feature_name_after:
                    flag = True
            actual_name = "_".join(actual_name_split)
            return actual_name + ":" + parts[-1]
        else:
            return col

    def _attach_datetime(self, df):
        df['date'] = pd.to_datetime(df['date'])
        df['datetime'] = df.apply(
            lambda row: row['date'].replace(
                hour=int(SEGMENT_TO_TIME[row['segment']].split(':')[0]),
                minute=int(SEGMENT_TO_TIME[row['segment']].split(':')[1]),
                second=int(SEGMENT_TO_TIME[row['segment']].split(':')[2])
            ),
            axis=1
        )
        return df

    def _exclude_features(self, df):
        use_columns = [
            col for col in df.columns
            if (
                col.lower() in ['pid', 'date']
                or (
                    any(keyword in col.lower() for keyword in TIME_KEYWORDS)
                    and not any(term in col.lower().split(":")[-1].split("_")
                                for term in ["norm", "dis"])
                )
            )
        ]
        return df[use_columns]

    def _include_features(self, df):
        identifiers = [feat + ":allday" for feat in self.include_features]
        use_columns = [
            col for col in df.columns
            if self._get_usable_feature_name(col) in ['pid', 'date'] or
            any(feat.lower() == self._get_usable_feature_name(col).lower()
                for feat in identifiers)
        ]
        print(len(use_columns), use_columns)
        return df[use_columns]

    def save_data(self):
        save_path = os.path.join(project_root, "data_processed",
                                 f"INS-W_{self.setName}_{self.featureName}_allday.csv")
        self.data_long.to_csv(save_path, index=False)
