import PatientInsightHeaderCard from "./PatientInsightHeaderCard";
import SuggestedActivitiesCard from "./SuggestedActivitiesCard";
import type {SuggestedActivity} from "@/types/dataTypes";

interface PatientCommunicationComponentProps {
    isDrillDown?: boolean;
    selectedInsightCardTitles: string[];
    suggested_activity_data: SuggestedActivity[];
    updateActivities: (activities: SuggestedActivity[]) => void;
}

function PatientCommunicationComponent({ isDrillDown, selectedInsightCardTitles, suggested_activity_data, updateActivities }: PatientCommunicationComponentProps) {    
    return (
        <div
            className={`flex gap-4 w-full ${
                isDrillDown ? "flex-col" : "flex-col sm:flex-row"
            }`}
        >
            <div className="flex-1 flex">
                <PatientInsightHeaderCard insights={selectedInsightCardTitles} />
            </div>
            <div className="flex-1 flex">
                <SuggestedActivitiesCard suggested_activity_data={suggested_activity_data} updateActivities={updateActivities} />
            </div>
        </div>
    );
}

export default PatientCommunicationComponent
