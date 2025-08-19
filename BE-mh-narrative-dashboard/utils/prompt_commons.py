
from kb.defs import NUMERICAL_FEATURE_KB


def get_mh_data_expert_system_prompt():
    # ! Using case tailored prompt
    return f"""
        You are a mental health expert with over 20 years of experience in practice.
        You will be treating a patient with depression. 
    """

# https://platform.openai.com/docs/guides/text?api-mode=responses#prompting-reasoning-models
OPENAI_AGENTIC_REC = """
You are an agent - please keep going until the user’s query is completely resolved, before ending your turn and yielding back to the user. Only terminate your turn when you are sure that the problem is solved.
"""

OPENAI_AGENTIC_TOOL_USE = """
If you are not sure about file content or codebase structure pertaining to the user’s request, use your tools to read files and gather the relevant information: do NOT guess or make up an answer.
"""

OPENAI_AGENTIC_PLANNING = """
You MUST plan extensively before each function call, and reflect extensively on the outcomes of the previous function calls. DO NOT do this entire process by making function calls only, as this can impair your ability to solve the problem and think insightfully.
"""

ALL_FEATURE_DESCRIPTION = "\n".join(
    f"[{category}] `{feature['rename']}`: {feature['description']}" for category, features in NUMERICAL_FEATURE_KB.items() for _, feature in features.items()
)

ALL_FEATURE_DESCRIPTION_W_UNITS = "\n".join(
    f"[{category}] {feature['rename']} ({feature['target_unit']}): {feature['description']}" for category, features in NUMERICAL_FEATURE_KB.items() for _, feature in features.items()
)
