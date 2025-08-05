import PatientInsightHeaderCard from "./PatientInsightHeaderCard";
import SuggestedActivitiesCard from "./SuggestedActivitiesCard";
import type {SuggestedActivity} from "@/types/dataTypes";


// const insights = [
//     "Increased social activity, yet remains in a closed circle",
//     "Growing Activity Level Despite Persistent Fatigue",
//     "Shift to Passive Consumption (App Usage Categories)",
// ];

// const activities = [
//     { label: "Just Five Minutes Rule", checked: true },
//     { label: "Energy Audit", checked: false },
//     { label: '"Tiny Wins" Journal', checked: false },
//     { label: "Purposeful Pauses", checked: true },
// ];

interface PatientCommunicationComponentProps {
    isDrillDown?: boolean;
    selectedInsightCardTitles: string[];
    suggested_activity_data: SuggestedActivity[]
}

function PatientCommunicationComponent({ isDrillDown, selectedInsightCardTitles, suggested_activity_data }: PatientCommunicationComponentProps) {    
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
                <SuggestedActivitiesCard suggested_activity_data={suggested_activity_data} />
            </div>
        </div>
    );
}

export default PatientCommunicationComponent
