# Discoverer Agents

## Primatives

### Single data source
* **Trend** (rise, fall, stable, cyclic)
* **Extreme** (max, min)
* **Difference** (delta)

### Multiple data sources
* [TBD] **Association** (must be between passive sensing data & measurement scores?)

## Compound facts

This is now implemented in proof-of-concept condition: i.e., the solution is not different than the primitive facts. However, this should theoretically be combined by more complicated agent orchestration.

* **Comparison**: compare two values (derive value + difference): We did not include derived value as a primative because it should be pretty straight forward with both machine (get a value at a certain date) or human (through charts). The derived value used for comparison under the current iteration is free form, which should be further structured as a future engineering task.

## Implicit data fact types

* **Value**: Visualized through tooltip. (Note: derived value is not considered here as we want to show clinicians the raw data [minimal interpretation], or its already computed within the dataset we are using)
* **Categorization**: Data is inherently categorized by its source (passive: passive sensing; active: measurement score, EHR, notes, transcript). This is visualized by icons.
* **Rank**: Visual analysis on extreme data fact.
* **Outliers**: Visual analysis on extreme data fact (within a time window).
* **Clusters**: Visual analysis on trend data fact (within a time window).
* **Metafact**: Data modalities will be explained with semantic and context, the implied meaning of different modalities explained in text.

## N/A

* **Distribution**: Only applicable crossing text and numeric data: such as the relevance distribution of a data insight on transcript/notes.