import {DatasourceIconTypes, DataSourceType, InsightType, type RetrospectOptions,} from "../types/props";

import {type BasicInfoCard, type InsightCard, type OverviewInfoCard, type SuggestedActivity} from "../types/dataTypes"

export const nameList = [
    "John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson", "David Brown",
    "Lisa Davis", "Tom Miller", "Emma Garcia", "Alex Martinez", "Olivia Taylor",
];

export const retrospectHorizon: RetrospectOptions = {
    "Since last encounter": 14,
    "Last month": 30,
    "Last 3 months": 90,
    "Last 6 months": 180,
    "Last year": 365,
};

export const cardData = [
    {
        key: "insight-1",
        title: "Increased social activity, yet remains in a closed circle",
        sources: [
            { type: DatasourceIconTypes.measurementScore },
            { type: DatasourceIconTypes.clinicalNotes },
            { type: DatasourceIconTypes.clinicalTranscripts }
        ]
    },
    {
        key: "insight-2",
        title: "Growing Activity Level Despite Persistent Fatigue",
        sources: [
            { type: DatasourceIconTypes.measurementScore },
            { type: DatasourceIconTypes.clinicalNotes }
        ]
    },
    {
        key: "insight-3",
        title: "Enhanced Cognitive Function and Focus",
        sources: [
            { type: DatasourceIconTypes.measurementScore },
            { type: DatasourceIconTypes.clinicalNotes },
            { type: DatasourceIconTypes.clinicalTranscripts },
            { type: DatasourceIconTypes.passiveSensing }
        ]
    }
];

// Main data export
export const data = {
    overview: {
        basicInfoCard: {
            name: "John Doe",
            age: 45,
            race: "Caucasian",
            income: 55000,
            relationship: "Married"
        } as BasicInfoCard,

        infoCards: [
            {
                icon: "history",
                overviewHeadTitle: "Medical History",
                cardContent: {
                    expanded: "Patient’s concerns are recurrent, severe, without psychotic features...",
                    folded: "History of recurrent severe depression; stable in recent years..."
                }
            },
            {
                icon: "history",
                overviewHeadTitle: "Sessions Recap",
                cardContent: {
                    expanded: "Mild improvement noted in mood stability...",
                    folded: "Mild mood improvement; fewer depressive symptoms;"
                }
            },
            {
                icon: "brain",
                overviewHeadTitle: "Current Concerns",
                cardContent: {
                    expanded: "Patient continues to report recurrent episodes of depression...",
                    folded: "Ongoing recurrent depression; symptoms in chest, and gut..."
                }
            },
            {
                icon: "medication",
                overviewHeadTitle: "Medication and Treatment",
                cardContent: {
                    expanded: "Patient is currently on Sertraline 150mg daily...",
                    folded: "On Sertraline 150mg daily; past CBT; no current substance use."
                }
            }
        ] as OverviewInfoCard[]
    },
    insights: [
        {
            key: "insight-1",
            summaryTitle: "Increased social activity, yet remains in a closed circle",
            sources: [
                { type: DatasourceIconTypes.measurementScore },
                { type: DatasourceIconTypes.clinicalNotes },
                { type: DatasourceIconTypes.clinicalTranscripts }
            ],
            insightType: [InsightType.SOCIAL, InsightType.EMOTIONAL],
            expandView: [
                {
                    summarySentence: "Social App Usage: Daily active time increased by 30%.",
                    dataPoints: { week1: 10, week2: 12, week3: 14, week4: 18 },
                    sources: [
                        { type: DatasourceIconTypes.measurementScore },
                        { type: DatasourceIconTypes.clinicalNotes },
                        { type: DatasourceIconTypes.clinicalTranscripts }
                    ],
                    dataSourceType: DataSourceType.DIFFERENCE
                },
                {
                    summarySentence: "GPS Data (New Locations Visited per Week): Average 1 new non-routine location/week",
                    dataPoints: { morning: 3, afternoon: 5, evening: 15, night: 2 },
                    sources: [
                        { type: DatasourceIconTypes.measurementScore },
                        { type: DatasourceIconTypes.clinicalNotes },
                        { type: DatasourceIconTypes.clinicalTranscripts }
                    ],
                    dataSourceType: DataSourceType.COMPARISON
                },
                {
                    summarySentence: "Patient Report: Increased effort in communication, primarily with their sister.",
                    dataPoints: { morning: 3, afternoon: 5, evening: 15, night: 2 },
                    sources: [
                        { type: DatasourceIconTypes.measurementScore },
                        { type: DatasourceIconTypes.clinicalNotes },
                        { type: DatasourceIconTypes.clinicalTranscripts }
                    ],
                    dataSourceType: DataSourceType.EXTREME
                }
            ]
        },
        {
            key: "insight-2",
            summaryTitle: "Growing Activity Level Despite Persistent Fatigue",
            sources: [
                { type: DatasourceIconTypes.measurementScore },
                { type: DatasourceIconTypes.clinicalNotes },
                { type: DatasourceIconTypes.clinicalTranscripts }
            ],
            insightType: [InsightType.ACTIVITY],
            expandView: [
                {
                    summarySentence: "Social interactions increased by 20% over the last month.",
                    dataPoints: { week1: 10, week2: 12, week3: 14, week4: 18 },
                    sources: [
                        { type: DatasourceIconTypes.measurementScore },
                        { type: DatasourceIconTypes.clinicalNotes },
                        { type: DatasourceIconTypes.clinicalTranscripts }
                    ]
                },
                {
                    summarySentence: "Peak social activity occurs in evenings.",
                    dataPoints: { morning: 3, afternoon: 5, evening: 15, night: 2 },
                    sources: [
                        { type: DatasourceIconTypes.measurementScore },
                        { type: DatasourceIconTypes.clinicalNotes },
                        { type: DatasourceIconTypes.clinicalTranscripts }
                    ]
                }
            ]
        },
        {
            key: "insight-3",
            summaryTitle: "Loss of Specific Activities Coinciding with Worsening Well-being",
            sources: [
                { type: DatasourceIconTypes.measurementScore },
                { type: DatasourceIconTypes.clinicalNotes },
                { type: DatasourceIconTypes.clinicalTranscripts },
            ],
            insightType: [InsightType.EMOTIONAL, InsightType.SOCIAL],
            expandView: [
                {
                    summarySentence: "Social interactions increased by 20% over the last month.",
                    dataPoints: {
                        week1: 10,
                        week2: 12,
                        week3: 14,
                        week4: 18
                    },
                    sources: [
                        { type: DatasourceIconTypes.measurementScore },
                        { type: DatasourceIconTypes.clinicalNotes },
                        { type: DatasourceIconTypes.clinicalTranscripts },
                    ]
                },
                {
                    summarySentence: "Peak social activity occurs in evenings.",
                    dataPoints: {
                        morning: 3,
                        afternoon: 5,
                        evening: 15,
                        night: 2
                    },
                    sources: [
                        { type: DatasourceIconTypes.measurementScore },
                        { type: DatasourceIconTypes.clinicalNotes },
                        { type: DatasourceIconTypes.clinicalTranscripts },
                    ]
                }
            ]
        },
        {
            key: "insight-4",
            summaryTitle: "Shift to Passive Consumption (App Usage Categories)",
            sources: [
                { type: DatasourceIconTypes.measurementScore },
                { type: DatasourceIconTypes.clinicalNotes },
                { type: DatasourceIconTypes.clinicalTranscripts },
            ],
            insightType: [InsightType.SOCIAL, InsightType.DIGITAL],
            expandView: [
                {
                    summarySentence: "Social interactions increased by 20% over the last month.",
                    dataPoints: {
                        week1: 10,
                        week2: 12,
                        week3: 14,
                        week4: 18
                    },
                    sources: [
                        { type: DatasourceIconTypes.measurementScore },
                        { type: DatasourceIconTypes.clinicalNotes },
                        { type: DatasourceIconTypes.clinicalTranscripts },
                    ]
                },
                {
                    summarySentence: "Peak social activity occurs in evenings.",
                    dataPoints: {
                        morning: 3,
                        afternoon: 5,
                        evening: 15,
                        night: 2
                    },
                    sources: [
                        { type: DatasourceIconTypes.measurementScore },
                        { type: DatasourceIconTypes.clinicalNotes },
                        { type: DatasourceIconTypes.clinicalTranscripts },
                    ]
                }
            ]
        },
        {
            key: "insight-5",
            summaryTitle: "Social Contraction Amidst High Loneliness and Anxiety",
            sources: [
                { type: DatasourceIconTypes.measurementScore },
                { type: DatasourceIconTypes.clinicalNotes },
                { type: DatasourceIconTypes.clinicalTranscripts },
            ],
            insightType: [InsightType.SOCIAL, InsightType.EMOTIONAL],
            expandView: [
                {
                    summarySentence: "Social interactions increased by 20% over the last month.",
                    dataPoints: {
                        week1: 10,
                        week2: 12,
                        week3: 14,
                        week4: 18
                    },
                    sources: [
                        { type: DatasourceIconTypes.measurementScore },
                        { type: DatasourceIconTypes.clinicalNotes },
                        { type: DatasourceIconTypes.clinicalTranscripts },
                    ]
                },
                {
                    summarySentence: "Peak social activity occurs in evenings.",
                    dataPoints: {
                        morning: 3,
                        afternoon: 5,
                        evening: 15,
                        night: 2
                    },
                    sources: [
                        { type: DatasourceIconTypes.measurementScore },
                        { type: DatasourceIconTypes.clinicalNotes },
                        { type: DatasourceIconTypes.clinicalTranscripts },
                    ]
                }
            ]
        },
    ] as InsightCard[],
    patientCommunication: {
        suggestedActivities: [
            {
                header: "Just Five Minutes Rule",
                description: "Start any task you're avoiding for just 5 minutes to build momentum."
            },
            {
                header: "Purposeful Pauses",
                description: "Take short intentional breaks like breathing or stretching..."
            }
        ] as SuggestedActivity[]
    }
};
