from utils.prompt_commons import ALL_FEATURE_DESCRIPTION

CATEGORIES = [
    "biological",
    "psychological",
    "social"
]

SYNT_CATEGORY_PROMPT = (
    "You should consider the generated insight based on the following |category|:\n"
    + "\n".join(f"* {category}" for category in CATEGORIES)
)

SYNT_CATEGORIZATION_PROMPT = (
    "The mental health clinician uses the biopsychosocial model in clinical practice:\n"
    + "\n".join(f"* {category}" for category in CATEGORIES)
    + "\n The insights you generate should reference this model."
)

SYNT_DATA_PROMPT = f"""
You are provided with a list of data facts described in the following format:
[|fact-id|] <|modality_type|: |feature_name|> |Data fact description|
where:
* |fact-id| is the unique identifier of the fact
* |modality_type| is either 'text', 'survey' or 'passive sensing'
* |feature_name| is the name of the feature
* |Data fact description| is a textual description of the data fact

Each data fact belongs to one of two types:
* Difference – Describes a change in value between two consecutive measurement dates. Sudden spikes or dips in value are considered clinically important.
* Extreme – Describes a local maximum or minimum value within a specific time window. Extreme events are considered clinically important.

In triple backticks below, you are provided with the description of the features:
```
{ALL_FEATURE_DESCRIPTION}
```
"""

SYNT_RULES = """
* Use no more than five data facts per insight, ranked by importance with the most important first.
* Each insight must belong to one and only one category in the biopsychosocial model.
* Prioritize insights that are clinically useful for conversation starters or supporting decision-making.
* Keep insights simple, concrete, and specific, with no more than 15 words each.
* Base insights strictly on the data facts; do not hallucinate, make unsupported claims, or use words like "indicates" or "suggests."
* Some generalization is allowed (e.g., survey scores → mood spikes/dips, passive sensing → physical activity).
* Do not start sentences with "The patient shows/has" or the patient’s name.
* Ensure observations respect the temporal granularity of the data.
"""