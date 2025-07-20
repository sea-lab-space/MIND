DATA_FACT_DEFINITION = {
    "comparison": {
        "definition": '''
            Comparisons is deﬁned on a 4-tuple(Xi, Dj, f, ∂).∀ xm, xn ∈ Xi, fD j(xm, xn) ≥ ∂ where f calculates the distance between xm and xn on Dj.
            Typically, comparisons involve two or more entities or values that exhibit significant differences.
            Comparative relationships are often expressed in phrases containing multiple entities or values that highlight notable disparities.
            Generally, sentences containing multiple sets of data are more suitable for this type and focus on difference.''',
        "examples": [
            "The number of students in class A is 30, while the number of students in class B is 50.",
            "The price of product A is $10, while the price of product B is $20.",
            "The sales of product A in January were 100 units, while the sales of product B in January were 200 units."
        ]
    },
    "trend": {
        "definition": '''
        Trend is deﬁned on a 6-tuple(Xi, Dj, T, t1, t2, R). R describes the movement feature of VDj(Xi) on T in the segment deﬁned by t1 and t2. T is usually a temporal attribute.
        Temporal changes usually consist of an entity and a phrase with changing semantics such as "increase", "decrease" or "rise", sometimes with numerical values.'''
    },
    "rank": {
        "definition": '''
        Rank is deﬁned on a 4-tuple(xm, Xi, dn, R). Ris the order of Vdn(xm) in sorted Vdn(Xi).
        Rank refers to sorting the data attributes based on their values and showing the position of selected data attributes.
        Rank usually includes entities and their corresponding sorting, which can be numbers such as 1 and NO.2, as well as letters and words such as "great" and "A level".'''
    },
    "proportion": {
        "definition": '''
        Proportion refers to measuring the proportion of selected data attribute(s) within a specified set. Proportions are usually a ratio or a fraction of one component compared to the whole, usually with phrases nearby that indicate proportion, such as "account for".
        If the decimals in the sentence point to the same whole, especially when the sum of these decimals is 1, it is more likely to belong to this type. Otherwise, it is more likely to belong to comparisons/ranks.'''
    },
    "extreme": {
        "definition": '''
        Extreme is deﬁned on a 3-tuple(xm, Xi, dn).  ∀ xl ∈ Xi and xl = xm, V dn(xm) ≥ Vdn(xl) or ∀ xl ∈ Xi and xl = xm, V dn(xm) ≤ Vdn(xl).
        Extreme refers to the extreme data cases along with the data attributes or within a certain range, can only be maximum and minimum. Notice that anomalies are individual data points and do not include trends such as "increase".'''
    },
    "anomaly": {
        "definition": '''Anomalies are usually data points that are significantly different from expected patterns.'''
    },
    "value": {
        "definition": '''
        Derived value is deﬁned on a 3-tuple(Xi, dn, R) where R is a derived value of Xi on dn. When Xi contains only 1 element, R is the value of the element on dn.
        Values are usually numerical valuesthat have a significant impact on entities.'''
    },
}
