import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
from utils.feature_loader import PassiveFeatureLoader


def plot_feature(df: PassiveFeatureLoader, daily: bool = True):
    # Set up the grid layout
    n_features = len(df.include_features)
    n_cols = 2  # Number of columns in the grid
    n_rows = (n_features + n_cols - 1) // n_cols  # Calculate needed rows

    # Create figure and axes grid
    fig, axes = plt.subplots(n_rows, n_cols, figsize=(15, 5 * n_rows), sharex=True)
    fig.tight_layout(pad=3.0)

    # Flatten axes array for easy iteration if it's multidimensional
    if n_rows > 1:
        axes = axes.flatten()
    else:
        axes = [axes] if n_cols == 1 else axes

    # Plot each feature in its own subplot
    for i, feat in enumerate(df.include_features):
        ax = axes[i]

        if daily:
            plot_data = df.data_long.groupby(['pid', pd.Grouper(key='datetime', freq='D')])[feat].sum().reset_index()
        else:
            plot_data = df.data_long
        sns.lineplot(
            data=plot_data,
            x='datetime',
            y=feat,
            hue='pid',
            ax=ax
        )

        # Rotate x-axis labels for better readability
        plt.setp(ax.get_xticklabels(), rotation=45)

    # Hide any empty subplots
    for j in range(i+1, len(axes)):
        axes[j].axis('off')

    plt.show()
