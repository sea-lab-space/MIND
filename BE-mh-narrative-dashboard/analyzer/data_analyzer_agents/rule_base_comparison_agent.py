import numpy as np
from MIND_types import FactComparisonConfig
import pandas as pd
from scipy.stats import mannwhitneyu


class RuleBaseComparisonAgent:
    def __init__(self, start_date: str, retrospect_date: str, end_date: str):
        self.start_date = start_date
        self.retrospect_date = retrospect_date
        self.end_date = end_date

    def run(self, feature: dict, alpha: float = 0.1, verbose: bool = False) -> dict:
        """
        Default alpha = 0.1
        """
        # Convert feature to pandas
        df = pd.DataFrame(feature)
        feature_name = df.columns[1]
        df.columns = ['ds', 'y']
        df['ds'] = pd.to_datetime(df['ds'])

        time_dur_1_df = df[
            (df['ds'] <= pd.to_datetime(self.retrospect_date)) &
            (df['ds'] >= pd.to_datetime(self.start_date))
        ]
        time_dur_2_df = df[(df['ds'] <= pd.to_datetime(self.end_date)) & (df['ds'] >= pd.to_datetime(self.retrospect_date))]

        time_dur_1_stream = time_dur_1_df['y'].dropna().to_numpy()
        time_dur_2_stream = time_dur_2_df['y'].dropna().to_numpy()

        u_stat, p_val = mannwhitneyu(
            time_dur_1_stream, time_dur_2_stream, alternative="two-sided")

        if verbose:
            # print(f"U-statistic: {u_stat}")
            print(f"{feature_name}, p-value: {p_val}")

        # if p_val < alpha:
        time_dur_1_val = float(np.nanmean(time_dur_1_stream))
        time_dur_2_val = float(np.nanmean(time_dur_2_stream))

        aggregation = "average"

        if abs(time_dur_1_val - time_dur_2_val) < 1e-3:
            comparison_type = "even"
        elif time_dur_1_val > time_dur_2_val:
            comparison_type = "less"
        elif time_dur_1_val < time_dur_2_val:
            comparison_type = "more"
        else:
            # raise error and halt program
            raise ValueError("Comparison type not defined")
        
        comparison_spec = FactComparisonConfig(
            name=feature_name,
            fact_type="comparison",
            attribute=comparison_type,
            time_dur_1={
                "time_start": self.start_date,
                "time_end": self.retrospect_date,
            },
            time_dur_2={
                "time_start": self.retrospect_date,
                "time_end": self.end_date,
            },
            aggregation=aggregation,
            value_dur_1=round(time_dur_1_val, 2),
            value_dur_2=round(time_dur_2_val, 2),
            significance="indicative" if p_val < alpha else "insignificant",
            fact_description="",
        )

        return comparison_spec.model_dump()
