from matplotlib import pyplot as plt
import numpy as np
import pandas as pd
from statsmodels.tsa.seasonal import STL
import seaborn as sns

from MIND_types.discoverer_numeric_type import FactOutlierConfig

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

        # Pinch data between start and end
        # df = df[(df['ds'] >= pd.to_datetime(self.start_date))
        #         & (df['ds'] <= pd.to_datetime(self.end_date))]
        

        # Set index to 'ds'
        df = df.set_index('ds')

        # Interpolate missing values along the existing time index
        df['y'] = df['y'].interpolate(method='time')

        # Drop any remaining NaNs (if start/end are missing)
        df = df.dropna(subset=['y'])
        # print(df['y'])

        # STL algorithim
        stl = STL(df['y'], period=2)
        # Fit STL decomposition
        result = stl.fit()
        trend = result.trend
        seasonal = result.seasonal
        resid = result.resid

        # Detect outliers using residuals (e.g., threshold method)
        # Use robust statistics (Median Absolute Deviation) to reduce effect of extreme outliers
        med_resid = np.median(resid)
        mad_resid = np.median(np.abs(resid - med_resid))
        # Threshold: points deviating more than alpha * MAD from median
        threshold = alpha * mad_resid
        outlier_mask = np.abs(resid - med_resid) > threshold

        # # Improved plotting
        # fig, axes = plt.subplots(3, 1, figsize=(14, 10), sharex=True)

        # # --- Original series with outliers ---
        # sns.lineplot(x=df.index, y=df['y'], label='Original', ax=axes[0], color='blue')
        # sns.lineplot(x=df.index, y=df['trend'],
        #             label='Trend', ax=axes[0], color='orange')
        # sns.lineplot(x=df.index, y=df['seasonal'],
        #             label='Seasonal', ax=axes[0], color='green')
        # axes[0].scatter(df.index[df['is_outlier']], df['y'][df['is_outlier']],
        #                 color='red', label='Outliers', s=50, zorder=5)
        # axes[0].set_title(f"{feature_name} - Original Series with Trend & Seasonal")
        # axes[0].set_ylabel("Value")
        # axes[0].legend()
        # axes[0].grid(True)

        # # --- Residuals with ±alpha*MAD ---
        # resid_upper = med_resid + alpha * mad_resid
        # resid_lower = med_resid - alpha * mad_resid
        # sns.lineplot(x=df.index, y=df['residual'],
        #             label='Residual', ax=axes[1], color='purple')
        # axes[1].fill_between(df.index, resid_lower, resid_upper, color='red', alpha=0.2,
        #                     label=f'±{alpha}×MAD')
        # axes[1].scatter(df.index[df['is_outlier']], df['residual'][df['is_outlier']],
        #                 color='red', s=50, zorder=5)
        # axes[1].set_title("Residuals with ±alpha*MAD Outlier Bounds")
        # axes[1].set_ylabel("Residual")
        # axes[1].legend()
        # axes[1].grid(True)

        # # --- Trend component only (optional) ---
        # sns.lineplot(x=df.index, y=df['trend'],
        #             label='Trend', ax=axes[2], color='orange')
        # axes[2].set_title("Trend Component")
        # axes[2].set_ylabel("Trend")
        # axes[2].set_xlabel("Date")
        # axes[2].grid(True)

        # plt.tight_layout()
        # plt.show()
        
        # Collect results
        df['trend'] = trend
        df['seasonal'] = seasonal
        df['residual'] = resid
        df['is_outlier'] = outlier_mask

        # pinch date in between start and end
        df = df[(df.index >= pd.to_datetime(self.start_date)) & (df.index <= pd.to_datetime(self.end_date))]

        # Collect all outliers in a list
        outlier_facts = []
        for date, row in df[df['is_outlier']].iterrows():
            attribute = 'spike' if row['residual'] > 0 else 'dip'
            fact = FactOutlierConfig(
                name=feature_name,
                attribute=attribute,
                value=row['y'],
                time=date.strftime("%Y-%m-%d")
            )
            # print(fact.fact_description)
            outlier_facts.append(fact.model_dump())


        if verbose:
            print(f"Detected {df['is_outlier'].sum()} outliers out of {len(df)} points.")
        return outlier_facts
