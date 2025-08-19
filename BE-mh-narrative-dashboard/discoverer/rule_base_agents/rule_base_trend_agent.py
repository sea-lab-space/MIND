import warnings
import numpy as np
from MIND_types import FactTrendConfig
import pandas as pd
from statsmodels.tsa.stattools import acf, kpss
import pymannkendall as mk

class RuleBaseTrendAgent:
    def __init__(self, start_date: str, end_date: str):
        self.start_date = start_date
        self.end_date = end_date

    def run(self, feature: dict, alpha: float = 0.1, cv_threshold: float = 0.15, verbose: bool = False) -> dict:
        """
        Default:
         - alpha = 0.1
         - cv_threshold = 0.15 (coefficient of variation (cv))
        """
        # Convert feature to pandas
        df = pd.DataFrame(feature)
        feature_name = df.columns[1]
        df.columns = ['ds', 'y']
        df['ds'] = pd.to_datetime(df['ds'])
        # Pinch data between start and end
        df = df[(df['ds'] >= pd.to_datetime(self.start_date)) & (df['ds'] <= pd.to_datetime(self.end_date))]


        data_stream = df["y"].to_numpy()

        # 1. Mann-Kendall test (trend detection)
        mk_result = mk.original_test(data_stream, alpha=alpha)

        trend_type = None

        if mk_result.trend == "increasing":
            trend_type = "rise"
        elif mk_result.trend == "decreasing":
            trend_type = "fall"
        else:
            data_series_interp = df['y'].interpolate(method='linear').dropna()
            data_stream = data_series_interp.to_numpy()
            # 2. No monotonic trend → check cyclicity
            acf_vals, confint = acf(data_series_interp, fft=True,
                                    missing='conservative', alpha=alpha)

            cyclic_detected = False
            for lag, (val, (low, high)) in enumerate(zip(acf_vals, confint)):
                if lag == 0:
                    continue
                if val < low or val > high:  # significant autocorrelation
                    cyclic_detected = True
                    break

            if cyclic_detected:
                trend_type = "cyclic"
            else:
                # if np.std(data_series_interp) < 1e-3:
                #     trend_type = "stable"
                # else:
                #     with warnings.catch_warnings():
                #         warnings.simplefilter("ignore", category=UserWarning)
                #         stat, _, _, crit_vals = kpss(
                #             data_series_interp, regression='c', nlags=1)

                #     # print(stat, crit_vals)
                #     if stat < crit_vals['10%']:
                #         trend_type = "stable"
                #     else:
                #         trend_type = "no trend"
                # --- CV-based stability detection ---
                mean_val = np.mean(data_series_interp)
                std_val = np.std(data_series_interp)
                cv = std_val / mean_val if mean_val != 0 else np.inf

                if cv < cv_threshold:
                    trend_type = "stable"
                elif cv > 0.3:
                    trend_type = "variable"
                else:
                    trend_type = "no trend"

        if verbose:
            print(feature_name, ":", trend_type)


        trend_spec = FactTrendConfig(
            name=feature_name,
            attribute=trend_type,
            time_1=self.start_date,
            time_2=self.end_date,
            fact_type="trend",
            fact_description=""
        )

        return trend_spec.model_dump()
