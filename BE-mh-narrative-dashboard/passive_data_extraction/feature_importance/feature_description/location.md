|  |  |  |
| --- | --- | --- |
| **Feature Name** | **Unit** | **Description** |
| `hometime` | minutes | Time at home. Time spent at home in minutes. Home is the most visited significant location between 8 pm and 8 am, including any pauses within a 200-meter radius. |
| `disttravelled` | meters | Total distance traveled over a day (flights). |
| `rog` | meters | The Radius of Gyration (rog) is a measure in meters of the area covered by a person over a day. A centroid is calculated for all the places (pauses) visited during a day, and a weighted distance between all the places and that centroid is computed. The weights are proportional to the time spent in each place. |
| `maxdiam` | meters | The maximum diameter is the largest distance between any two pauses. |
| `maxhomedist` | meters | The maximum distance from home in meters. |
| `siglocsvisited` | locations | The number of significant locations visited during the day. Significant locations are computed using k-means clustering over pauses found in the whole monitoring period. The number of clusters is found iterating k from 1 to 200 stopping until the centroids of two significant locations are within 400 meters of one another. |
| `avgflightlen` | meters | Mean length of all flights. |
| `stdflightlen` | meters | Standard deviation of the length of all flights. |
| `avgflightdur` | seconds | Mean duration of all flights. |
| `stdflightdur` | seconds | The standard deviation of the duration of all flights. |
| `probpause` | - | The fraction of a day spent in a pause (as opposed to a flight). |
| `siglocentropy` | nats | Shannon’s entropy measurement is based on the proportion of time spent at each significant location visited during a day. |
| `circdnrtn` | - | A continuous metric quantifying a person’s circadian routine that can take any value between 0 and 1, where 0 represents a daily routine completely different from any other sensed days and 1 a routine the same as every other sensed day. |
| `wkenddayrtn` | - | Same as circdnrtn but computed separately for weekends and weekdays. |
| `locationvariance` | meters2 | The sum of the variances of the latitude and longitude columns. |
| `loglocationvariance` | - | Log of the sum of the variances of the latitude and longitude columns. |
| `totaldistance` | meters | Total distance traveled in a time segment using the haversine formula. |
| `avgspeed` | km/hr | Average speed in a time segment considering only the instances labeled as Moving. This feature is 0 when the participant is stationary during a time segment. |
| `varspeed` | km/hr | Speed variance in a time segment considering only the instances labeled as Moving. This feature is 0 when the participant is stationary during a time segment. |
| `numberofsignificantplaces` | places | Number of significant locations visited. It is calculated using the DBSCAN/OPTICS clustering algorithm which takes in EPS and MIN\_SAMPLES as parameters to identify clusters. Each cluster is a significant place. |
| `numberlocationtransitions` | transitions | Number of movements between any two clusters in a time segment. |
| `radiusgyration` | meters | Quantifies the area covered by a participant. |
| `timeattop1location` | minutes | Time spent at the most significant location. |
| `timeattop2location` | minutes | Time spent at the 2nd most significant location. |
| `timeattop3location` | minutes | Time spent at the 3rd most significant location. |
| `movingtostaticratio` | - | Ratio between stationary time and total location sensed time. A lat/long coordinate pair is labeled as stationary if its speed (distance/time) to the next coordinate pair is less than 1km/hr. A higher value represents a more stationary routine. |
| `outlierstimepercent` | - | Ratio between the time spent in non-significant clusters divided by the time spent in all clusters (stationary time. Only stationary samples are clustered). A higher value represents more time spent in non-significant clusters. |
| `maxlengthstayatclusters` | minutes | Maximum time spent in a cluster (significant location). |
| `minlengthstayatclusters` | minutes | Minimum time spent in a cluster (significant location). |
| `avglengthstayatclusters` | minutes | Average time spent in a cluster (significant location). |
| `stdlengthstayatclusters` | minutes | Standard deviation of time spent in a cluster (significant location). |
| `locationentropy` | nats | Shannon Entropy computed over the row count of each cluster (significant location), it is higher the more rows belong to a cluster (*i.e.*, the more time a participant spent at a significant location). |
| `normalizedlocationentropy` | nats | Shannon Entropy computed over the row count of each cluster (significant location) divided by the number of clusters; it is higher the more rows belong to a cluster (*i.e.*, the more time a participant spent at a significant location). |
| `timeathome` | minutes | Time spent at home. |
| `timeat[PLACE]` | minutes | Time spent at `[PLACE]`, which can be living, exercise, study, greens. |