LOCATION_CIRCADIAN = """
A continuous metric (0–1) quantifying the regularity of a person's daily routine. A value of 0 indicates highly irregular behavior, while 1 indicates a perfectly consistent routine across days.
"""

LOCATION_NUMBER_OF_SIGNIFICANT_PLACES = """
Number of significant locations visited during a time segment. Computed using clustering algorithms (e.g., DBSCAN or OPTICS).
"""

LOCATION_RADIUS_GYRATION = """
A measure of the area covered by a participant in meters. It is the weighted average distance from all visited places to a calculated central point, with weights based on time spent at each location.
"""

LOCATION_TIME_AT_HOME = """
Time spent at home in minutes. Home is defined as the most visited significant location between 8 pm and 8 am, including any pauses within a 200-meter radius.
"""

LOCATION_TOTAL_DISTANCE = """
Total distance traveled in a time segment in meters.
"""

LOCATION_DURATION_IN_LOCAMP_EXERCISE = """
Time spent at the location labeled as 'exercise' in minutes.
"""

LOCATION_DURATION_IN_GREEN = """
Time spent at the location labeled as 'green space' (e.g., parks, outdoor areas) in minutes.
"""

LOCATION_DURATION_IN_STUDY = """
Time spent at the location labeled as 'study' (e.g., libraries, classrooms) in minutes.
"""
