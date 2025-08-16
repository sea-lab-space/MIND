# SLEEP_AVERAGE_DURATION = """
# Average sleep duration during a time segment.
# """

# SLEEP_AVERAGE_AWAKE_DURATION = """
# Average duration the user stayed awake but still in bed during a time segment.
# """

# SLEEP_COUNT_EPISODE_ASLEEP = """
# Number of sleep episodes during a time segment.
# """

SLEEP_COUNT_EPISODE_AWAKE = """
The number of times a person wakes up during sleep.
"""

# SLEEP_MAX_DURATION_ASLEEP = """
# Max duration of any sleep episode.
# """

# SLEEP_MAX_DURATION_AWAKE = """
# Max duration the user stayed awake but still in bed during a time segment.
# """

SLEEP_SUM_DURATION= """
Total sleep duration per day.
"""

# SLEEP_SUM_DURATION_AWAKE= """
# Sum duration of any user stayed awake but still in bed episode.
# """

SLEEP_FIRST_BEDTIME= """
Time of first bedtime after midnight every day, i.e., when the person goes to bed.
The value is the number of hours after midnight: 
* If the value is -0.5, it means the person sleeps at 11:30 PM the previous day.
* If the value is 0.5, it means the person sleeps at 12:30 AM the current day.
"""

# SLEEP_FIRST_AWAKE_TIME= """
# First wake time during a time segment. 
# Wake time is number of minutes after midnight of a sleep episode end time.
# """

# SLEEP_LAST_BED_TIME="""
# Last bedtime during a time segment.
#  Bedtime is number of minutes after midnight of a sleep episodes start time.
# """

SLEEP_LAST_AWAKE_TIME="""
Time of last wake time after midnight, i.e., when the person gets up.
Wake time is number of hours after midnight:
* If the value is 9.5, it means the person sleeps at 9:30 AM..
"""
