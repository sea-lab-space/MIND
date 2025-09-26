from kb.location import (
    LOCATION_TIME_AT_HOME,
    LOCATION_TOTAL_DISTANCE,
    LOCATION_CIRCADIAN
)
from kb.screen import (
    SCREEN_COUNT_EPISODE_UNLOCK,
    SCREEN_SUM_DURATION_UNLOCK,
)
from kb.sleep import (
    SLEEP_COUNT_EPISODE_AWAKE,
    SLEEP_SUM_DURATION,
    SLEEP_FIRST_BEDTIME,
    SLEEP_LAST_AWAKE_TIME,
)
from kb.steps import (
    STEPS_COUNT_BOUT,
    STEPS_SUM_STEPS,
)
from kb.survey_score import (
    PHQ4,
    PHQ4_ANXIETY,
    PHQ4_DEPRESSION,
    PSS4,
    PANAS_POS,
    PANAS_NEG,
)

NUMERICAL_FEATURE_KB = {
    "location": {
        "totaldistance": {
            "rename": "Distance Traveled (Miles)",
            "unit": "meters",
            "target_unit": "miles",
            "description": LOCATION_TOTAL_DISTANCE
        },
        "timeathome": {
            "rename": "Time Spent at Home (Hours)",
            "unit": "minutes",
            "target_unit": "hours",
            "description": LOCATION_TIME_AT_HOME
        },
        "circdnrtn": {
            "rename": "Routine Consistency (0 irregular, 100 regular)",
            "unit": None,
            "target_unit": None,
            "description": LOCATION_CIRCADIAN
        },
    },
    "screen": {
        "countepisodeunlock": {
            "rename": "Phone Unlocks (Times)",
            "unit": "count",
            "target_unit": "times",
            "description": SCREEN_COUNT_EPISODE_UNLOCK
        },
        "sumdurationunlock": {
            "rename": "Total Screen Time (Hours)",
            "unit": "minutes",
            "target_unit": "hours",
            "description": SCREEN_SUM_DURATION_UNLOCK
        },
    },
    "sleep": {
        "countepisodeawakeunifiedmain": {
            "rename": "Awakening Episodes (Times)",
            "unit": "count",
            "target_unit": "times",
            "description": SLEEP_COUNT_EPISODE_AWAKE,
        },
        "sumdurationasleepunifiedmain": {
            "rename": "Total Sleep (hours)",
            "unit": "minutes",
            "target_unit": "hours",
            "description": SLEEP_SUM_DURATION,
        },
        "firstbedtimemain": {
            "rename": "Bedtime (Hours in relation to midnight)",
            "unit": "minutes",
            "target_unit": "hours",
            "description": SLEEP_FIRST_BEDTIME
        },
        "lastwaketimemain": {
            "rename": "Wake Time (Hours in relation to midnight)",
            "unit": "minutes",
            "target_unit": "hours",
            "description": SLEEP_LAST_AWAKE_TIME
        }
    },
    "steps": {
        "countepisodesedentarybout": {
            "rename": "Inactive Periods (Times)",
            "unit": "count",
            "target_unit": "times",
            "description": STEPS_COUNT_BOUT
        },
        "sumsteps": {
            "rename": "Total Steps (Steps)",
            "unit": "count",
            "target_unit": "steps",
            "description": STEPS_SUM_STEPS
        }
    },
    "survey": {
        "phq4_EMA": {
            "rename": "PHQ-4 (0-12)",
            "unit": None,
            "target_unit": None,
            "description": PHQ4
        },
        "phq4_anxiety_EMA": {
            "rename": "PHQ-4 Anxiety Subscale (0-6)",
            "unit": None,
            "target_unit": None,
            "description": PHQ4_ANXIETY,
        },
        "phq4_depression_EMA": {
            "rename": "PHQ-4 Depression Subscale (0-6)",
            "unit": None,
            "target_unit": None,
            "description": PHQ4_DEPRESSION,
        },
        "pss4_EMA": {
            "rename": "PSS-4 Score (0-16)",
            "unit": None,
            "target_unit": None,
            "description": PSS4,
        },
        "positive_affect_EMA": {
            "rename": "Positive Affect Subscale (5-25, PANAS-SF)",
            "unit": None,
            "target_unit": None,
            "description": PANAS_POS,
        },
        "negative_affect_EMA": {
            "rename": "Negative Affect Subscale (5-25, PANAS-SF)",
            "unit": None,
            "target_unit": None,
            "description": PANAS_NEG,
        }
    }
}
