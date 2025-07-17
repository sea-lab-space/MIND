import { DatasourceIconTypes, type RetrospectOptions } from "../types/props";

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
            { type: DatasourceIconTypes.clinicalTranscripts },
        ],
    },
    {
        key: "insight-2",
        title: "Growing Activity Level Despite Persistent Fatigue",
        sources: [
            { type: DatasourceIconTypes.measurementScore },
            { type: DatasourceIconTypes.clinicalNotes },
        ],
    },
    {
        key: "insight-3",
        title: "Enhanced Cognitive Function and Focus",
        sources: [
            { type: DatasourceIconTypes.measurementScore },
            { type: DatasourceIconTypes.clinicalNotes },
            { type: DatasourceIconTypes.clinicalTranscripts },
            { type: DatasourceIconTypes.passiveSensing },
        ],
    },
];

export const data = {
    "overview": {
        "basicInfoCard": {
            "name": "John Doe",
            "age": 45,
            "race": "Caucasian",
            "income": 55000,
            "relationship": "Married"
        },
        "infoCards": [
            {
                "icon": "history",
                "overviewHeadTitle": "Medical History",
                "cardContent": {
                    "expanded": "Patient’s concern are recurrent, severe, without psychotic features. Reported episodes since early teens, and the severity remained stable for the past few years. " +
                        "He has a history of two previous psychiatric hospitalizations for severe depression with suicidal ideation, most recently five years ago.",
                    "folded": "History of recurrent severe depression; stable in recent years; two hospitalizations, last one five years ago."
                }
            },
            {
                "icon": "history",
                "overviewHeadTitle": "Sessions Recap",
                "cardContent": {
                    "expanded": "Progress (Past 6 Months): Mild improvement noted in mood stability and coping strategies, with a reduction in reported depressive symptoms. Patient has maintained consistent engagement in therapy and medication adherence. No suicidal ideation reported in the past six months.",
                    "folded": "Mild mood improvement; fewer depressive symptoms;"
                }
            },
            {
                "icon": "brain",
                "overviewHeadTitle": "Current Concerns",
                "cardContent": {
                    "expanded": "Current Concerns: Patient continues to report recurrent episodes of depression, consistent with their long-standing history, with somatic symptoms primarily located in the chest and abdomen, including tightness and nausea.",
                    "folded": "Ongoing recurrent depression; Symptoms in chest, and gut; no neurological deficits."
                }
            },
            {
                "icon": "medication",
                "overviewHeadTitle": "Medication and Treatment",
                "cardContent": {
                    "expanded": "Patient is currently on Sertraline 150mg daily. Previously engaged in CBT treatments. Patient denies current substance use disorder.",
                    "folded": "On Sertraline 150mg daily; past CBT; no current substance use."
                }
            },
        ]
    },

    "insights": [
        {
            key: "insight-1",
            summaryTitle: "Increased social activity, yet remains in a closed circle",
            sources: [
                { type: DatasourceIconTypes.measurementScore },
                { type: DatasourceIconTypes.clinicalNotes },
                { type: DatasourceIconTypes.clinicalTranscripts },
            ],
            expandView: [
                {
                    summarySentence: "Social App Usage: Daily active time increased by 30%.",
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
                    summarySentence: "GPS Data (New Locations Visited per Week): Average 1 new non-routine location/week",
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
                },
                {
                    summarySentence: "Patient Report: Increased effort in communication, primarily with their sister.",
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
            key: "insight-2",
            summaryTitle: "Growing Activity Level Despite Persistent Fatigue",
            sources: [
                { type: DatasourceIconTypes.measurementScore },
                { type: DatasourceIconTypes.clinicalNotes },
                { type: DatasourceIconTypes.clinicalTranscripts },
            ],
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
            key: "insight-3",
            summaryTitle: "Loss of Specific Activities Coinciding with Worsening Well-being",
            sources: [
                { type: DatasourceIconTypes.measurementScore },
                { type: DatasourceIconTypes.clinicalNotes },
                { type: DatasourceIconTypes.clinicalTranscripts },
            ],
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
    ],

    "patientCommunication": {
        "suggestedActivities": [
            {
                "header": "Just Five Minutes Rule",
                "description": "Start any task you’re avoiding for just 5 minutes to build momentum."
            },
            {
                "header": "Purposeful Pauses",
                "description": "Take short intentional breaks like breathing or stretching to improve self-regulation."
            }
        ]
    }
}

