import seaborn as sns
import matplotlib.pyplot as plt
from utils.feature_loader import PassiveFeatureLoader


def plot_feature(df: PassiveFeatureLoader):
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
        sns.lineplot(
            data=df.data_long,
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
