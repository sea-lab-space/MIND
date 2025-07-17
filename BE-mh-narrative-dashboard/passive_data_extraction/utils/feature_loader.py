from copy import deepcopy
import os
import pandas as pd

import sys
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
print(project_root)
sys.path.append(project_root)

from utils.date_filter import DATE_RANGE, filter_dates

TIME_KEYWORDS = [":morning", ":afternoon", ":evening", ":night"]

SEGMENT_TO_TIME = {
    'morning': '05:59:59',    # 6AM
    'afternoon': '11:59:59',  # 12PM (noon)
    'evening': '17:59:59',    # 6PM
    'night': '23:59:59'       # 12AM (midnight)
}

class PassiveFeatureLoader:
    global TIME_KEYWORDS 
    global SEGMENT_TO_TIME

    def __init__(self, setName: str, featureName: str, includeFeatures: list, filterPID: list = None, interpolate: bool = True):
        self.setName, self.featureName = setName, featureName
        self.directory = os.path.join(project_root, "data_raw", "INS-W_" + setName, "FeatureData", featureName + ".csv")
        self.include_features = includeFeatures
        self.data_raw = filter_dates(self._load_csv(filterPID), DATE_RANGE[int(setName)]['start'], DATE_RANGE[int(setName)]['end'])
        self.data_filtered = self._filter_data(self.data_raw)
        self.data_long = self._process_data_long_form(self.data_filtered, interpolate)

    def _load_csv(self, filterPID = None):
        df = pd.read_csv(self.directory, low_memory=False)
        if filterPID is not None:
            return df[df['pid'].isin(filterPID)]
        else:
            return df
    
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
        # Address data MAR (missing at random): time-based inputation
        df = df.sort_values(['pid', 'datetime'])
        df = df.set_index('datetime')

        # Group by 'pid' and 'segment'; time and linear is essentially the same because the interval is assigned the same
        df[self.include_features] = df.groupby(['pid', 'segment'])[self.include_features].transform(
            lambda x: x.interpolate(method='time', limit_direction='both')
        )
        # Reset the index to bring 'datetime' back as a column
        return df.reset_index()

    def _pivot_features(self, df):
        melted_data = df.melt(
            id_vars=["pid", "date"],
            value_vars=[
                col for col in df.columns
                if any(metric in col for metric in self.include_features)
            ],
            var_name="variable",
            value_name="value"
        )

        melted_data['segment'] = None

        for time_segment in SEGMENT_TO_TIME.keys():
            time_suffix = ":" + time_segment
            mask = melted_data['variable'].str.endswith(time_suffix)
            melted_data.loc[mask, 'segment'] = time_segment
            melted_data.loc[mask, 'metric'] = melted_data.loc[mask, 'variable'].str[:-len(time_suffix)]

        pivoted_data = melted_data.pivot_table(
            index=["pid", "date", "segment"],
            columns="metric",
            values="value",        
            aggfunc='first',
            dropna=False 
        ).reset_index()

        # Improved solution for unambiguous column renaming
        rename = {}
        for col in pivoted_data.columns:
            parts = col.split(':')
            if len(parts) >= 2:
                feature_part = parts[1]
                # split by _
                feature_name_split = feature_part.split("_")
                # get actual feature name
                feature_name_after = ["rapids", "doryab", "barnett", "locmap"]
                actual_name_split = []
                flag = False
                for feature_split in feature_name_split:
                    if flag:
                        actual_name_split.append(feature_split)
                    if feature_split in feature_name_after:
                        flag = True
                        continue
                actual_name = "_".join(actual_name_split)
                if actual_name in self.include_features:
                    rename[col] = actual_name
                else:
                    # drop this column
                    pivoted_data = pivoted_data.drop(columns=[col])
            else:
                rename[col] = col  # malformed or unexpected column format

        pivoted_data = pivoted_data.rename(columns=rename)

        return pivoted_data
    
    def _get_usable_feature_name(self, col):
            parts = col.split(':')
            if len(parts) >= 2:
                feature_part = parts[1]
                # split by _
                feature_name_split = feature_part.split("_")
                # get actual feature name
                feature_name_after = ["rapids", "doryab", "barnett", "locmap"]
                actual_name_split = []
                flag = False
                for feature_split in feature_name_split:
                    if flag:
                        actual_name_split.append(feature_split)
                    if feature_split in feature_name_after:
                        flag = True
                        continue
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
        columns = df.columns
        use_columns = [
            col for col in columns
            if (
                col.lower() in ['pid', 'date']
                or (
                    any(keyword in col.lower() for keyword in TIME_KEYWORDS)
                    and
                    not any(term in col.lower().split(":")[-1].split("_")
                            for term in ["norm", "dis"])
                )
            )
        ]
        return df[use_columns]
        
    def _include_features(self, df):
        columns = df.columns
        identifiers = [
            feat + segment for feat in self.include_features for segment in TIME_KEYWORDS
        ]
        use_columns = [col for col in columns if (self._get_usable_feature_name(col) in ['pid', 'date'] or any(
            feat.lower() == self._get_usable_feature_name(col).lower() for feat in identifiers))]
        
        print(len(use_columns), use_columns)
        return df[use_columns]
    
    def save_data(self):
        self.data_long.to_csv(os.path.join(project_root, "data_processed", "INS-W_" + self.setName + "_" + self.featureName + ".csv"), index=False)
        
        
# if __name__ == "__main__":
#     loader = PassiveFeatureLoader(
#         setName="4",
#         featureName="bluetooth",
#         includeFeatures=["uniquedevices",
#                          "countscansmostfrequentdevicewithinsegments"],
#         filterPID=['INS-W_928', 'INS-W_1218', 'INS-W_1217', 'INS-W_1202',
#                                   'INS-W_1209', 'INS-W_1084', 'INS-W_937', 'INS-W_1025', 'INS-W_1005'])
#     print(loader.data_long.head())