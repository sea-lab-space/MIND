import { type InsightExpandViewItem } from "@/types/props";
import InsightGraph from "@/components/DataInsights/InsightGraph";
import { shouldShowChart } from "@/utils/helper";

export interface SurveyScoreDetailProps {
    surveyScoreFacts: InsightExpandViewItem[] | undefined;
    isBaseline?: boolean;
}

type SurveyInfo = {
    label: string;
    definition: string;
};

// Mapping dictionary
const surveyMap: Record<string, SurveyInfo> = {
    "positive affect subscale (5-25, panas-sf)": {
        label: "Positive Affect Scores",
        definition: "A 5-item subscale of the Positive and Negative Affect Schedule Short Form (PANAS-SF) that measures positive affect. Each item is rated 1-5, with a total score range of 5-25. Higher scores reflect greater positive affect."
    },
    "negative affect subscale (5-25, panas-sf)": {
        label: "Negative Affect Scores",
        definition: "A 5-item subscale of the Positive and Negative Affect Schedule Short Form (PANAS-SF) that measures negative affect. Each item is rated 1-5, with a total score range of 5-25. Higher scores reflect greater negative affect."
    },
    "phq-4 (0-12)": {
        label: "PHQ-4 Score",
        definition: "A 4-item survey for mental health conditions, including anxiety and depression. Each item is rated 0-3, with a total score range of 0-12, " +
            "calculated by summing all four items. Interpretation of total scores: Normal (0-2), Mild (3-5), Moderate (6-8), Severe (9-12)."
    },
    "phq-4 depression subscale (0-6)": {
        label: "PHQ-4 Depression Subscale",
        definition: "A subscale of PHQ-4, consisting of the last two items of PHQ-4. Scores range from 0-6, with scores greater than 3 suggesting depression."
    },
    "phq-4 anxiety subscale (0-6)": {
        label: "PHQ-4 Anxiety Subscale",
        definition: "A subscale of PHQ-4, consisting of the first two items of PHQ-4. Scores range from 0-6, with scores greater than 3 suggesting anxiety."
    },
    "pss-4 score (0-16)": {
        label: "Perceived Stress Scale (PSS-4)",
        definition: "A 4-item measure of perceived stress. Each item is rated 0-4, with a total score range of 0-16. Higher scores indicate greater levels of perceived stress, with scores greater than 6 suggesting high stress."
    }
};

export default function SurveyScoreDetail({
                                              surveyScoreFacts,
                                          }: SurveyScoreDetailProps) {
    function getSurveyInfo(key) {
        return surveyMap[key] || null;
    }

    return (
        <div className="space-y-2 pt-3 pl-3 text-sm">
            <div className="space-y-4">
                {surveyScoreFacts?.map((detail, index) => {

                    const match = detail.summarySentence.match(/^Displaying (.*) survey scores\.$/);
                    const surveyName: string | null = match ? match[1] : null;
                    const surveyInfo = getSurveyInfo(surveyName)

                    const showChart = shouldShowChart(
                        detail.dataSourceType,
                        detail.dataPoints
                    );

                    return  (
                        <div key={detail.key}>
                            <h3 className="text-md font-semibold text-gray-900">
                                {surveyInfo?.label}
                            </h3>
                            <div className="flex items-start gap-3">
                                <>
                                    <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-gray-700 ml-1">
                                        {surveyInfo?.definition}
                                </span>
                                </>
                            </div>

                            {showChart && (
                                <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg h-48 pr-4 pt-4">
                                    <InsightGraph
                                        data={detail.dataPoints}
                                        highlightSpec={detail.highlightSpec}
                                        dataSourceType={detail.dataSourceType}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
