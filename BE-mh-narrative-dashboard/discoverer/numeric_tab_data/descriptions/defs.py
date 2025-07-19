from discoverer.numeric_tab_data.descriptions.bluetooth import BLUETOOTH_UNIQUE_DEVICES
from discoverer.numeric_tab_data.descriptions.wifi import WIFI_UNIQUE_DEVICES
from discoverer.numeric_tab_data.descriptions.call import (
    CALL_INCOMING_COUNT,
    CALL_MISSED_COUNT,
    CALL_OUTGOING_COUNT,
)
from discoverer.numeric_tab_data.descriptions.location import (
    LOCATION_NUMBER_OF_SIGNIFICANT_PLACES,
    LOCATION_RADIUS_GYRATION,
    LOCATION_TIME_AT_HOME,
    LOCATION_TOTAL_DISTANCE,
    LOCATION_DURATION_IN_EXERCISE,
    LOCATION_DURATION_IN_GREEN,
    LOCATION_DURATION_IN_STUDY,
    LOCATION_CIRCADIAN
)
from discoverer.numeric_tab_data.descriptions.screen import (
    SCREEN_AVERAGE_DURATION_UNLOCK,
    SCREEN_COUNT_EPISODE_UNLOCK,
    SCREEN_MAX_DURATION_UNLOCK,
    SCREEN_SUM_DURATION_UNLOCK,
    SCREEN_AVERAGE_DURATION_UNLOCK_HOME,
    SCREEN_COUNT_EPISODE_UNLOCK_HOME,
    SCREEN_MAX_DURATION_UNLOCK_HOME,
    SCREEN_SUM_DURATION_UNLOCK_HOME,
)
from discoverer.numeric_tab_data.descriptions.sleep import (
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
from discoverer.numeric_tab_data.descriptions.steps import (
    STEPS_COUNT_BOUT,
    STEPS_SUM_STEPS,
)
from discoverer.numeric_tab_data.descriptions.survey_score import (
    PHQ4,
    PHQ4_ANXIETY,
    PHQ4_DEPRESSION,
    PSS4,
    PANAS,
    PANAS_POS,
    PANAS_NEG,
)

NUMERICAL_FEATURE_DEFS = {
    "bluetooth": {
        "uniquedevices": BLUETOOTH_UNIQUE_DEVICES,
    },
    "wifi": {
        "uniquedevices": WIFI_UNIQUE_DEVICES,
    },
    "call": {
        "incoming_count": CALL_INCOMING_COUNT,
        "missed_count": CALL_MISSED_COUNT,
        "outgoing_count": CALL_OUTGOING_COUNT,
    },
    "location": {
        "numberofsignificantplaces": LOCATION_NUMBER_OF_SIGNIFICANT_PLACES,
        "radiusgyration": LOCATION_RADIUS_GYRATION,
        "timeathome": LOCATION_TIME_AT_HOME,
        "totaldistance": LOCATION_TOTAL_DISTANCE,
        "duration_in_locmap_exercise": LOCATION_DURATION_IN_EXERCISE,
        "duration_in_locmap_greens": LOCATION_DURATION_IN_GREEN,
        "duration_in_locmap_study": LOCATION_DURATION_IN_STUDY,
        "circdnrtn": LOCATION_CIRCADIAN,
    },
    "screen": {
        "avgdurationunlock": SCREEN_AVERAGE_DURATION_UNLOCK,
        "avgdurationunlock_locmap_home": SCREEN_AVERAGE_DURATION_UNLOCK_HOME,
        "countepisodeunlock": SCREEN_COUNT_EPISODE_UNLOCK,
        "countepisodeunlock_locmap_home": SCREEN_COUNT_EPISODE_UNLOCK_HOME,
        "maxdurationunlock": SCREEN_MAX_DURATION_UNLOCK,
        "maxdurationunlock_locmap_home": SCREEN_MAX_DURATION_UNLOCK_HOME,
        "sumdurationunlock": SCREEN_SUM_DURATION_UNLOCK,
        "sumdurationunlock_locmap_home": SCREEN_SUM_DURATION_UNLOCK_HOME,
    },
    "sleep": {
        "avgdurationasleepunifiedmain": SLEEP_AVERAGE_DURATION,
        "avgdurationawakeunifiedmain": SLEEP_AVERAGE_AWAKE_DURATION,
        "countepisodeasleepunifiedmain": SLEEP_COUNT_EPISODE_ASLEEP,
        "countepisodeawakeunifiedmain": SLEEP_COUNT_EPISODE_AWAKE,
        "maxdurationasleepunifiedmain": SLEEP_MAX_DURATION_ASLEEP,
        "maxdurationawakeunifiedmain": SLEEP_MAX_DURATION_AWAKE,
        "sumdurationasleepunifiedmain": SLEEP_SUM_DURATION,
        "sumdurationawakeunifiedmain": SLEEP_SUM_DURATION_AWAKE,
        "firstbedtimemain": SLEEP_FIRST_BEDTIME,
        "firstwaketimemain": SLEEP_FIRST_AWAKE_TIME,
        "lastbedtimemain": SLEEP_LAST_BED_TIME,
        "lastwaketimemain": SLEEP_LAST_AWAKE_TIME,
    },
    "steps": {
        "countepisodesedentarybout": STEPS_COUNT_BOUT,
        "sumsteps": STEPS_SUM_STEPS,
    },
    "survey": {
        "phq4_EMA": PHQ4,
        "phq4_anxiety_EMA": PHQ4 + PHQ4_ANXIETY,
        "phq4_depression_EMA": PHQ4 + PHQ4_DEPRESSION,
        "pss4_EMA": PSS4,
        "positive_affect_EMA": PANAS + PANAS_POS,
        "negative_affect_EMA": PANAS + PANAS_NEG,
    }
}
