|  |  |  |
| --- | --- | --- |
| **Feature Name** | **Unit** | **Description** |
| `count` | calls | Number of calls of a particular `call_type` (incoming/outgoing) occurred during a particular `time_segment`. |
| `distinctcontacts` | contacts | Number of distinct contacts that are associated with a particular `call_type` for a particular `time_segment`. |
| `meanduration` | seconds | The mean duration of all calls of a particular `call_type` during a particular `time_segment`. |
| `sumduration` | seconds | The sum of the duration of all calls of a particular `call_type` during a particular `time_segment`. |
| `minduration` | seconds | The duration of the shortest call of a particular `call_type` during a particular `time_segment`. |
| `maxduration` | seconds | The duration of the longest call of a particular `call_type` during a particular `time_segment`. |
| `stdduration` | seconds | The standard deviation of the duration of all the calls of a particular `call_type` during a particular `time_segment`. |
| `modeduration` | seconds | The mode of the duration of all the calls of a particular `call_type` during a particular `time_segment`. |
| `entropyduration` | nats | The estimate of the Shannon entropy for the the duration of all the calls of a particular `call_type` during a particular `time_segment`. |
| `timefirstcall` | minutes | The time in minutes between 12:00am (midnight) and the first call of `call_type`. |
| `timelastcall` | minutes | The time in minutes between 12:00am (midnight) and the last call of `call_type`. |
| `countmostfrequentcontact` | calls | The number of calls of a particular `call_type` during a particular `time_segment` of the most frequent contact throughout the monitored period. |