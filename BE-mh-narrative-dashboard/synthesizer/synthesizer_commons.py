CATEGORIES = [
    "Sleep Patterns",
    "Physical Activity",
    "Digital Engagement",
    "Emotional State",
    "Social Interaction",
    "Medication & Treatment"
]

SYNT_CATEGORY_PROMPT = (
    "You should consider the generated insight based on the following |category/categories|:\n"
    + "\n".join(f"* {category}" for category in CATEGORIES)
)

SYNT_DATA_PROMPT = f"""
You are provided with a list of data facts described in the following format:
[|fact-id|] <|modality_type|: |feature_name|> |Data fact description|
where:
* |fact-id| is the unique identifier of the fact
* |modality_type| is either 'text', 'survey' or 'passive sensing'
* |feature_name| is the name of the feature
* |Data fact description| is a textual description of the data fact
"""

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

SYNT_RULES = """
Consider the following rules:
* Prioritize insights that uses multiple modalities. The best insight comes from seeing a combination of clinical note, session transcript, survey and passive sensing data.
* Seek for inconsistencies and consistencies between the different features.
* Cover as many of the |category/categories| as possible, without being forced. Each insight could either be around one or multiple categories.
* Prioritize insights that can be used as conversation starters to help clinicians better understand the patient.
* Prioritize insights that can be used to help clinicians make better decisions.
* Describe data insight that could be useful for mental health clinicians, but do not say the insight 'indicates' or 'suggests' anything. 
* Be concrete, specific, but succinct. Do not use more than 15 words for each data insight.
* Mimic the examples provided by the expert. There is no need to start sentences with 'The patient shows' or 'The patient has'.
"""








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
