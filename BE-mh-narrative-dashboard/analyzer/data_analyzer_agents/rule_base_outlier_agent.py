import numpy as np
import pandas as pd
from statsmodels.tsa.seasonal import STL

from MIND_types.analyzer_numeric_type import FactOutlierConfig

class RuleBaseOutlierAgent:
    def __init__(self, start_date: str, end_date: str):
        self.start_date = start_date
        self.end_date = end_date

    def run(self, feature: dict, alpha: float = 3, verbose: bool = False) -> dict:
        """
        Default alpha = 3, i.e., outlier 3 SD residual
        """

        # Convert feature to pandas
        df = pd.DataFrame(feature)
        feature_name = df.columns[1]
        df.columns = ['ds', 'y']
        df['ds'] = pd.to_datetime(df['ds'])

        # Set index to 'ds'
        df = df.set_index('ds')

        # Interpolate missing values along the existing time index
        df['y'] = df['y'].interpolate(method='time')

        # Drop any remaining NaNs (if start/end are missing)
        df = df.dropna(subset=['y'])

        # STL algorithim
        stl = STL(df['y'], period=2)
        # Fit STL decomposition
        result = stl.fit()
        trend = result.trend
        seasonal = result.seasonal
        resid = result.resid

        # Detect outliers using residuals
        med_resid = np.median(resid)
        mad_resid = np.median(np.abs(resid - med_resid))
        # Threshold: points deviating more than alpha * MAD from median
        threshold = alpha * mad_resid
        outlier_mask = np.abs(resid - med_resid) > threshold

        df['trend'] = trend
        df['seasonal'] = seasonal
        df['residual'] = resid
        df['is_outlier'] = outlier_mask

        # pinch date in between start and end
        df = df[(df.index >= pd.to_datetime(self.start_date)) & (df.index <= pd.to_datetime(self.end_date))]

        outlier_facts = []
        for date, row in df[df['is_outlier']].iterrows():
            attribute = 'spike' if row['residual'] > 0 else 'dip'
            fact = FactOutlierConfig(
                name=feature_name,
                attribute=attribute,
                value=row['y'],
                time=date.strftime("%Y-%m-%d")
            )
            outlier_facts.append(fact.model_dump())


        if verbose:
            print(f"Detected {df['is_outlier'].sum()} outliers out of {len(df)} points.")
        return outlier_facts
