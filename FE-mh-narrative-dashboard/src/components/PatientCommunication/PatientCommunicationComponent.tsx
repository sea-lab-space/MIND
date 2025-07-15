import PatientInsightHeaderCard from "./PatientInsightHeaderCard";
import SuggestedActivitiesCard from "./SuggestedActivitiesCard";


// const insights = [
//     "Increased social activity, yet remains in a closed circle",
//     "Growing Activity Level Despite Persistent Fatigue",
//     "Shift to Passive Consumption (App Usage Categories)",
// ];

const activities = [
    { label: "Just Five Minutes Rule", checked: true },
    { label: "Energy Audit", checked: false },
    { label: '"Tiny Wins" Journal', checked: false },
    { label: "Purposeful Pauses", checked: true },
];
interface PatientCommunicationComponentProps {
    isDrillDown?: boolean;
    selectedInsightCardTitles: string[];
}

function PatientCommunicationComponent({ isDrillDown, selectedInsightCardTitles }: PatientCommunicationComponentProps) {
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
                <SuggestedActivitiesCard initialActivities={activities} />
            </div>
        </div>
    );
}

export default PatientCommunicationComponent
