from matplotlib import pyplot as plt
import numpy as np
import pandas as pd
from statsmodels.tsa.seasonal import STL
import seaborn as sns

# ! Deprecated

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
        df = df[(df['ds'] >= pd.to_datetime(self.start_date))
                & (df['ds'] <= pd.to_datetime(self.end_date))]
        
        df = df.set_index('ds').interpolate()

        print(df['y'])

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

        # Collect results
        df['trend'] = trend
        df['seasonal'] = seasonal
        df['residual'] = resid
        df['is_outlier'] = outlier_mask


        # visualize use sns
        # visualize using seaborn / matplotlib
        plt.figure(figsize=(12, 6))

        # Original series
        sns.lineplot(x=df.index, y=df['y'], label='Original', color='blue')

        # Trend
        sns.lineplot(x=df.index, y=df['trend'], label='Trend', color='orange')

        # Seasonal component
        sns.lineplot(x=df.index, y=df['seasonal'], label='Seasonal', color='green')

        # Highlight outliers
        plt.scatter(df.index[df['is_outlier']], df['y'][df['is_outlier']],
                    color='red', label='Outliers', zorder=5, s=50)

        # Show residual ± alpha * MAD as shaded area
        upper_bound = trend + seasonal + med_resid + alpha * mad_resid
        lower_bound = trend + seasonal + med_resid - alpha * mad_resid
        plt.fill_between(df.index, lower_bound, upper_bound,
                        color='red', alpha=0.2, label=f'±{alpha}×MAD')

        plt.title(f"{feature_name} - STL Decomposition with Outliers")
        plt.xlabel("Date")
        plt.ylabel("Value")
        plt.legend()
        plt.tight_layout()
        plt.show()


        if verbose:
            print(
                f"Detected {outlier_mask.sum()} outliers out of {len(df)} points.")

        # Return output as dictionary
        result_dict = {
            'feature_name': feature_name,
            'data': df,
            'outliers': df[df['is_outlier']]
        }
        return result_dict
