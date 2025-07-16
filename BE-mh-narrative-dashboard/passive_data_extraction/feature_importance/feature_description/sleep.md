|  |  |  |
| --- | --- | --- |
| **Feature Name** | **Unit** | **Description** |
| `countepisode[LEVEL][TYPE]` | episodes | Number of `[LEVEL][TYPE]` sleep episodes. `[LEVEL]` is one of awake and asleep and `[TYPE]` is one of main, nap, and all. Same below. |
| `sumduration[LEVEL][TYPE]` | minutes | Total duration of all `[LEVEL][TYPE]` sleep episodes. |
| `maxduration[LEVEL][TYPE]` | minutes | Longest duration of any `[LEVEL][TYPE]` sleep episode. |
| `minduration[LEVEL][TYPE]` | minutes | Shortest duration of any `[LEVEL][TYPE]` sleep episode. |
| `avgduration[LEVEL][TYPE]` | minutes | Average duration of all `[LEVEL][TYPE]` sleep episodes. |
| `medianduration[LEVEL][TYPE]` | minutes | Median duration of all `[LEVEL][TYPE]` sleep episodes. |
| `stdduration[LEVEL][TYPE]` | minutes | Standard deviation duration of all `[LEVEL][TYPE]` sleep episodes. |
| `firstwaketimeTYPE` | minutes | First wake time for a certain sleep type during a time segment. Wake time is number of minutes after midnight of a sleep episode’s end time. |
| `lastwaketimeTYPE` | minutes | Last wake time for a certain sleep type during a time segment. Wake time is number of minutes after midnight of a sleep episode’s end time. |
| `firstbedtimeTYPE` | minutes | First bedtime for a certain sleep type during a time segment. Bedtime is number of minutes after midnight of a sleep episode’s start time. |
| `lastbedtimeTYPE` | minutes | Last bedtime for a certain sleep type during a time segment. Bedtime is number of minutes after midnight of a sleep episode’s start time. |
| `countepisodeTYPE` | episodes | Number of sleep episodes for a certain sleep type during a time segment. |
| `avgefficiencyTYPE` | scores | Average sleep efficiency for a certain sleep type during a time segment. |
| `sumdurationafterwakeupTYPE` | minutes | Total duration the user stayed in bed after waking up for a certain sleep type during a time segment. |
| `sumdurationasleepTYPE` | minutes | Total sleep duration for a certain sleep type during a time segment. |
| `sumdurationawakeTYPE` | minutes | Total duration the user stayed awake but still in bed for a certain sleep type during a time segment. |
| `sumdurationtofallasleepTYPE` | minutes | Total duration the user spent to fall asleep for a certain sleep type during a time segment. |
| `sumdurationinbedTYPE` | minutes | Total duration the user stayed in bed (sumdurationtofallasleep + sumdurationawake + sumdurationasleep + sumdurationafterwakeup) for a certain sleep type during a time segment. |
| `avgdurationafterwakeupTYPE` | minutes | Average duration the user stayed in bed after waking up for a certain sleep type during a time segment. |
| `avgdurationasleepTYPE` | minutes | Average sleep duration for a certain sleep type during a time segment. |
| `avgdurationawakeTYPE` | minutes | Average duration the user stayed awake but still in bed for a certain sleep type during a time segment. |
| `avgdurationtofallasleepTYPE` | minutes | Average duration the user spent to fall asleep for a certain sleep type during a time segment. |
| `avgdurationinbedTYPE` | minutes | Average duration the user stayed in bed (`sumdurationtofallasleep` + `sumdurationawake` + `sumdurationasleep` + `sumdurationafterwakeup`) for a certain sleep type during a time segment. |