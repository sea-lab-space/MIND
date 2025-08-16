from kb.bluetooth import BLUETOOTH_UNIQUE_DEVICES
from kb.wifi import WIFI_UNIQUE_DEVICES
from kb.call import (
    CALL_INCOMING_COUNT,
    CALL_MISSED_COUNT,
    CALL_OUTGOING_COUNT,
)
from kb.location import (
    LOCATION_NUMBER_OF_SIGNIFICANT_PLACES,
    LOCATION_RADIUS_GYRATION,
    LOCATION_TIME_AT_HOME,
    LOCATION_TOTAL_DISTANCE,
    LOCATION_DURATION_IN_EXERCISE,
    LOCATION_DURATION_IN_GREEN,
    LOCATION_DURATION_IN_STUDY,
    LOCATION_CIRCADIAN
)
from kb.screen import (
    SCREEN_AVERAGE_DURATION_UNLOCK,
    SCREEN_COUNT_EPISODE_UNLOCK,
    SCREEN_MAX_DURATION_UNLOCK,
    SCREEN_SUM_DURATION_UNLOCK,
    SCREEN_AVERAGE_DURATION_UNLOCK_HOME,
    SCREEN_COUNT_EPISODE_UNLOCK_HOME,
    SCREEN_MAX_DURATION_UNLOCK_HOME,
    SCREEN_SUM_DURATION_UNLOCK_HOME,
)
from kb.sleep import (
    SLEEP_AVERAGE_DURATION,
    SLEEP_AVERAGE_AWAKE_DURATION,
    SLEEP_COUNT_EPISODE_ASLEEP,
    SLEEP_COUNT_EPISODE_AWAKE,
    SLEEP_MAX_DURATION_ASLEEP,
    SLEEP_MAX_DURATION_AWAKE,
    SLEEP_SUM_DURATION,
    SLEEP_SUM_DURATION_AWAKE,
    SLEEP_FIRST_BEDTIME,
    SLEEP_FIRST_AWAKE_TIME,
    SLEEP_LAST_BED_TIME,
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
    PANAS,
    PANAS_POS,
    PANAS_NEG,
)

NUMERICAL_FEATURE_KB = {
    # "bluetooth": {
    #     "uniquedevices": {
    #         "rename": "Unique Bluetooth Devices",
    #         "unit": "count",
    #         "description": BLUETOOTH_UNIQUE_DEVICES
    #     }
    # },
    # "wifi": {
    #     "uniquedevices": {
    #         "rename": "Unique WiFi Devices",
    #         "unit": "count",
    #         "description": WIFI_UNIQUE_DEVICES
    #     }
    # },
    # "call": {
    #     "incoming_count": {
    #         "rename": "Incoming Call Count",
    #         "unit": "count",
    #         "description": CALL_INCOMING_COUNT
    #     },
    #     "missed_count": {
    #         "rename": "Missed Call Count",
    #         "unit": "count",
    #         "description": CALL_MISSED_COUNT
    #     },
    #     "outgoing_count": {
    #         "rename": "Outgoing Call Count",
    #         "unit": "count",
    #         "description": CALL_OUTGOING_COUNT
    #     }
    # },
    "location": {
        # "numberofsignificantplaces": {
        #     "rename": "Number of Significant Places",
        #     "unit": "count",
        #     "description": LOCATION_NUMBER_OF_SIGNIFICANT_PLACES
        # },
        # "radiusgyration": {
        #     "rename": "Radius of Travel",
        #     "unit": "meters",
        #     "description": LOCATION_RADIUS_GYRATION
        # },
        "totaldistance": {
            "rename": "Distance Traveled",
            "unit": "meters",
            "translate_unit": "miles",
            "description": LOCATION_TOTAL_DISTANCE
        },
        "timeathome": {
            "rename": "Time Spent at Home",
            "unit": "minutes",
            "translate_unit": "minutes",
            "description": LOCATION_TIME_AT_HOME
        },
        "duration_in_locmap_exercise": {
            "rename": "Excercise Time",
            "unit": "minutes",
            "translate_unit": "minutes",
            "description": LOCATION_DURATION_IN_EXERCISE
        },
        "duration_in_locmap_greens": {
            "rename": "Time in Nature",
            "unit": "minutes",
            "translate_unit": "minutes",
            "description": LOCATION_DURATION_IN_GREEN
        },
        "duration_in_locmap_study": {
            "rename": "Study Time",
            "unit": "minutes",
            "translate_unit": "minutes",
            "description": LOCATION_DURATION_IN_STUDY
        },
        "circdnrtn": {
            "rename": "Routine Consistency",
            "unit": None,
            "translate_unit": None,
            "description": LOCATION_CIRCADIAN
        },
    },
    "screen": {
        # "avgdurationunlock": {
        #     "rename": "Average Screen Unlock Duration",
        #     "unit": "minutes",
        #     "description": SCREEN_AVERAGE_DURATION_UNLOCK
        # },
        # "avgdurationunlock_locmap_home": {
        #     "rename": "Average Screen Unlock Duration at Home",
        #     "unit": "minutes",
        #     "description": SCREEN_AVERAGE_DURATION_UNLOCK_HOME
        # },
        "countepisodeunlock": {
            "rename": "Phone Unlocks",
            "unit": "count",
            "translate_unit": "times",
            "description": SCREEN_COUNT_EPISODE_UNLOCK
        },
        # "countepisodeunlock_locmap_home": {
        #     "rename": "Number of Screen Unlock Episodes at Home",
        #     "unit": "count",
        #     "description": SCREEN_COUNT_EPISODE_UNLOCK_HOME
        # },
        # "maxdurationunlock": {
        #     "rename": "Maximum Screen Unlock Duration",
        #     "unit": "minutes",
        #     "description": SCREEN_MAX_DURATION_UNLOCK
        # },
        # "maxdurationunlock_locmap_home": {
        #     "rename": "Maximum Screen Unlock Duration at Home",
        #     "unit": "minutes",
        #     "description": SCREEN_MAX_DURATION_UNLOCK_HOME
        # },
        "sumdurationunlock": {
            "rename": "Total Screen Time",
            "unit": "minutes",
            "translate_unit": "hours",
            "description": SCREEN_SUM_DURATION_UNLOCK
        },
        # "sumdurationunlock_locmap_home": {
        #     "rename": "Total Screen Unlock Duration at Home",
        #     "unit": "minutes",
        #     "description": SCREEN_SUM_DURATION_UNLOCK_HOME
        # }
    },
    "sleep": {
        # "avgdurationasleepunifiedmain": {
        #     "rename": "Average Sleep Duration",
        #     "unit": "minutes",
        #     "description": SLEEP_AVERAGE_DURATION
        # },
        # "avgdurationawakeunifiedmain": {
        #     "rename": "Average Awake Duration",
        #     "unit": "minutes",
        #     "description": SLEEP_AVERAGE_AWAKE_DURATION,
        # },
        # "countepisodeasleepunifiedmain": {
        #     "rename": "Number of Sleep Episodes",
        #     "unit": "count",
        #     "description": SLEEP_COUNT_EPISODE_ASLEEP,
        # },
        "countepisodeawakeunifiedmain": {
            "rename": "Awake Episodes in Bed",
            "unit": "count",
            "translate_unit": "times",
            "description": SLEEP_COUNT_EPISODE_AWAKE,
        },
        # "maxdurationasleepunifiedmain": {
        #     "rename": "Maximum Sleep Duration",
        #     "unit": "minutes",
        #     "description": SLEEP_MAX_DURATION_ASLEEP,
        # },
        # "maxdurationawakeunifiedmain": {
        #     "rename": "Maximum Awake Duration",
        #     "unit": "minutes",
        #     "description": SLEEP_MAX_DURATION_AWAKE,
        # },
        "sumdurationasleepunifiedmain": {
            "rename": "Total Sleep",
            "unit": "minutes",
            "translate_unit": "hours",
            "description": SLEEP_SUM_DURATION,
        },
        # "sumdurationawakeunifiedmain": {
        #     "rename": "Total Awake Duration",
        #     "unit": "minutes",
        #     "description": SLEEP_SUM_DURATION_AWAKE,
        # },
        "firstbedtimemain": {
            "rename": "Bedtime",
            "unit": "minutes",
            "translate_unit": "hours",
            "description": SLEEP_FIRST_BEDTIME
        },
        # "firstwaketimemain": {
        #     "rename": "First Wake Time",
        #     "unit": "time",
        #     "description": SLEEP_FIRST_AWAKE_TIME
        # },
        # "lastbedtimemain": {
        #     "rename": "Last Bedtime",
        #     "unit": "time",
        #     "description": SLEEP_LAST_BED_TIME
        # },
        "lastwaketimemain": {
            "rename": "Wake Time",
            "unit": "minutes",
            "translate_unit": "hours",
            "description": SLEEP_LAST_AWAKE_TIME
        }
    },
    "steps": {
        "countepisodesedentarybout": {
            "rename": "Inactive Periods",
            "unit": "count",
            "translate_unit": "times",
            "description": STEPS_COUNT_BOUT
        },
        "sumsteps": {
            "rename": "Total Steps",
            "unit": "count",
            "translate_unit": "steps",
            "description": STEPS_SUM_STEPS
        }
    },
    "survey": {
        "phq4_EMA": {
            "rename": "PHQ-4 Score",
            "unit": None,
            "translate_unit": None,
            "description": PHQ4
        },
        "phq4_anxiety_EMA": {
            "rename": "PHQ-4 Anxiety Score",
            "unit": None,
            "translate_unit": None,
            "description": PHQ4 + PHQ4_ANXIETY,
        },
        "phq4_depression_EMA": {
            "rename": "PHQ-4 Depression Score",
            "unit": None,
            "translate_unit": None,
            "description": PHQ4 + PHQ4_DEPRESSION,
        },
        "pss4_EMA": {
            "rename": "PSS-4 Score",
            "unit": None,
            "translate_unit": None,
            "description": PSS4,
        },
        "positive_affect_EMA": {
            "rename": "Positive Affect Score",
            "unit": None,
            "translate_unit": None,
            "description": PANAS + PANAS_POS,
        },
        "negative_affect_EMA": {
            "rename": "Negative Affect Score",
            "unit": None,
            "translate_unit": None,
            "description": PANAS + PANAS_NEG,
        }
    }
}
