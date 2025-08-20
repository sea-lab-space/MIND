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


# SYNT_RULES = """
# Below are the rules:
# * For each insight, use no more than 5 data facts.
# * Rank the used data facts by their importance and list the most important first.
# * Each insight should belong to one and only one |category| in the biopsychosocial model.
# * Prioritize insights that can be used as conversation starters to help clinicians better understand the patient.
# * Prioritize insights that can be used to help clinicians make better decisions.
# * Prioritize insightful but simple insights.
# * Describe data insight that could be useful for mental health clinicians, but do not say the insight 'indicates' or 'suggests' anything. 
# * You can make some generalization: e.g., from survey scores to infer mood spikes or dip, or from passive sensing data to infer physical activity.
# * Be concrete, specific, but succinct. Do not use more than 15 words for each data insight.
# * Do not start sentences with 'The patient shows' or 'The patient has', 'she/he shows' or 'she/he has' or patient's name.
# * Ensure insights are strictly grounded in the data. Do not hallucinate or introduce unsupported claims. Avoid risky assumptions—only draw conclusions that are directly supported by the data's granularity and structure (e.g., if the data is daily, do not infer behaviors at an hourly or sub-daily level).
# """

# * Prioritize insights that uses multiple modalities. The best insight comes from seeing a combination of clinical note, session transcript, survey and passive sensing data.
# * Seek for inconsistencies and consistencies between the different features.
# Cover as many of the |category/categories| as possible, without being forced.







# ! Discarded ReAct prompt
SYNT_REACT_PROMPT = """
You have access to the following tools:
retrive_data_fact_spec: Accurately returns the data facts in the given format.

Use the tool and analyze the data facts to generate insights for mental health clinicians. Use the following format:

Thought [n]: The multimodal data insight you propose
Act [n]: Retrive the data facts that supports the insight, use [retrive_data_fact_spec]
Observation [n]: Observe if 1) the insight is grounded by the data facts, and 2) how well it follows the above mentioned rules.

... (this Thought/Act/Observation can repeat n times)

Begin!
"""

# ! Discarded Complex insight prompt
SYNT_EXAMPLES = """
Below are some good examples provided by a mental health expert. Mimic the succinct insight description style and learn from the examples.

Example 1:
Insight description: Growing activity despite fatigue
Reasoning: The patient shows increased mobility and participation in routine tasks (suggested by location, step, circadian features from passive sensing), despite continued reports of tiredness (from session transcript). Elevated PHQ-4 and PSS-4 scores indicate that depressive symptoms and perceived stress remain high, suggesting the increased activity may be effortful or externally driven rather than reflecting improved mood (from survey score).

Example 2:
Insight description: Fragmented digital engagement
Reasoning: The patient demonstrates short, irregular periods of digital device use (suggested by passive sensing of screen use), consistent with reported difficulty concentrating or emotional restlessness (from session transcript and clinical note). Elevated PHQ-4 anxiety scores and high negative affect on the PANAS further support the presence of agitation or cognitive fatigue (from survey score).

Example 3:
Insight description: Increased social activity, in a closed circle
Reasoning: The patient is visiting more locations (passive sensing), but the patient previously reported talking only to his/her close relatives (session transcript), and also validated by previous notes (clinical notes).
"""
