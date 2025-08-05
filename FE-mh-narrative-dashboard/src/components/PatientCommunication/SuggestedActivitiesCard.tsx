import { useEffect, useState } from "react";
import { Lightbulb } from "lucide-react";
import { Checkbox, Label, Card, CardContent } from "@/components/ui"
import type {SuggestedActivity} from "@/types/dataTypes";


interface ActivityOptionExtended {
    label: string;
    description: string;
    checked: boolean;
}

interface SuggestedActivitiesCardProps {
    suggested_activity_data: SuggestedActivity[]
}

function SuggestedActivitiesCard({
                                     suggested_activity_data,
                                                }: SuggestedActivitiesCardProps) {


    const [activities, setActivities] = useState<ActivityOptionExtended[]>([]);

    useEffect(() => {
            const detailedActivities: ActivityOptionExtended[] =
              suggested_activity_data.map((a) => ({
                label: a.name,
                description: a.description,
                checked: false,
              }));

            setActivities(detailedActivities);
        
    }, [suggested_activity_data])



    const toggleActivity = (index: number) => {
        const updated = [...activities];
        updated[index].checked = !updated[index].checked;
        setActivities(updated);
    };

    return (
        <Card className="border border-gray-200 w-full">
            <CardContent className="px-6 py-2">
                <div className="flex items-start gap-3">
                    <Lightbulb className="text-yellow-500 mt-1" size={20} />
                    <div className="w-full">
                        <h3 className="font-semibold text-black text-base">
                            Suggested Activities
                        </h3>
                        <p className="text-sm text-gray-500 italic mb-3">
                            * Toggle activities to include an activity suggestion to patients
                        </p>

                        <div className="flex flex-col gap-3">
                            {activities.map((activity, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Checkbox
                                        id={`activity-${index}`}
                                        checked={activity.checked}
                                        onCheckedChange={() => toggleActivity(index)}
                                    />
                                    <Label htmlFor={`activity-${index}`} className="text-sm text-black">
                                        {activity.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default SuggestedActivitiesCard;
