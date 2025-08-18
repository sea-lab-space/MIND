# Discoverer Agents

! This document is out of date

## Primatives

* **Trend** (rise, fall, stable, cyclic)
* **Extreme** (max, min)
* **Difference** (delta) - Similar to comparison, but bar the value aggregation

## Compound facts


### Supported Facts

* **Comparison**: compare two values (derive value + difference): We did not include derived value as a primative because it should be pretty straight forward with both machine (get a value at a certain date) or human (through charts). The derived value used for comparison under the current iteration is free form, which should be further structured as a future engineering task.
* **Derived value**: Computed value from a data source (normally linked to exteme events)

### Supported aggregation operations

Data aggregation is conducted through agent tool use. We support the following aggregations, inspired by [VegaLite's implementation of data operations](https://vega.github.io/vega-lite/docs/aggregate.html#ops):


| Operation | Description                                                                             | is include | Reasoning                                                               |
| --------- | --------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------- |
| count     | The total count of data objects in the group.                                           | ❌          | N/A               |
| valid     | The count of field values that are not null, undefined or NaN.                          | ❌          | Not important for clinicians                  |
| values    | A list of data objects in the group.                                                    | ❌          | Not suitable for summary comparison; too granular.                      |
| missing   | The count of null or undefined field values.                                            | ❌          | Not important for clinicians                                 |
| distinct  | The count of distinct field values.                                                     | ❌          | Not important for clinicians                                  |
| sum       | The sum of field values.                                                                | ➖          | TODO: Future work that supports time wraping                   |
| product   | The product of field values.                                                            | ❌          | N/A                     |
| mean      | The mean (average) field value.                                                         | ✅          | Named average in our implementation                       |
| average   | The mean (average) field value. Identical to mean.                                      | ✅          | Core statistic for comparing central tendencies.                                          |
| variance  | The sample variance of field values.                                                    | ❌          | Use standardard deviation instead            |
| variancep | The population variance of field values.                                                | ❌          | Use standardard deviation instead                |
| stdev     | The sample standard deviation of field values.                                          | ✅          | Widely used, interpretable measure of variability.                      |
| stdevp    | The population standard deviation of field values.                                      | ❌          | Use sample as it is for a individual  |
| stderr    | The standard error of field values.                                                     | ❌          | No population in time series data                 |
| median    | The median field value.                                                                 | ✅          | Robust measure of central tendency; less sensitive to outliers.         |
| q1        | The lower quartile boundary of field values.                                            | ❌          | If implemented, in frontend compute                                |
| q3        | The upper quartile boundary of field values.                                            | ❌          | If implemented, in frontend compute                      |
| ci0       | The lower boundary of the bootstrapped 95% confidence interval of the mean field value. | ❌          | If implemented, in frontend compute    |
| ci1       | The upper boundary of the bootstrapped 95% confidence interval of the mean field value. | ❌          | If implemented, in frontend compute         |
| min       | The minimum field value.                                                                | ✅          | Important for detecting floor effects or anomalies.                     |
| max       | The maximum field value.                                                                | ✅          | Highlights peaks or spikes in the data stream.                          |
| argmin    | An input data object containing the minimum field value.                                | ❌          | Too specific; not a summary-level metric.                               |
| argmax    | An input data object containing the maximum field value.                                | ❌          | Same as above.                                                          |


## Implicit data fact types

* **Categorization**: Data is inherently categorized by its source (passive: passive sensing; active: measurement score, EHR, notes, transcript). This is visualized by icons.
* **Rank**: Visual analysis on extreme data fact.
* **Outliers**: Visual analysis on extreme data fact (within a time window).
* **Clusters**: Visual analysis on trend data fact (within a time window).
* **Metafact**: Data modalities will be explained with semantic and context, the implied meaning of different modalities explained in text.

## Inferred during later stages

* **Association**: How different data modalities interact (e.g., A increase accompanied by B increase)
* **Distribution**: Only applicable crossing text and numeric data: such as the relevance distribution of a data insight on transcript/notes.