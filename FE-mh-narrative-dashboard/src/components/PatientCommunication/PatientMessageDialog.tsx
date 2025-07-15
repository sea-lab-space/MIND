import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function PatientMessageDialog({ open, onOpenChange }: Props) {
    const [message, setMessage] = useState<string>(`Dear [Patient Name],

This communication outlines observations derived from your recent activity data and provides evidence-based strategies to support your well-being.

We have noted a positive trend in your increased social engagement, which is a significant indicator of progress. Concurrently, your overall activity level has demonstrated growth. These are encouraging developments. We recognize that despite these increases, you may still be experiencing persistent fatigue. This symptom can be challenging, and we acknowledge its impact.

To further support your progress, we recommend the implementation of the following strategies:

1. Just Five Minutes Rule:
   - Application: Start any task you're avoiding for just 5 minutes.
   - Rationale: Initiation often overcomes resistance and builds momentum.

2. Purposeful Pauses:
   - Application: Take short intentional breaks (e.g., breathing, stretching, calming audio).
   - Rationale: These are acts of self-regulation, not lost time.

We encourage you to integrate these into your daily routine and observe their effects. Incremental, consistent actions can lead to meaningful improvements.

Sincerely,
Your Care Team`);

    const handleSend = () => {
        console.log("Sending message:", message);
        // You can connect this to your backend logic
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent   style={{ width: "900px", maxWidth: "90vw" }}
                             className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center">
                    <DialogTitle className="text-xl font-semibold">
                        Patient Communication Message
                    </DialogTitle>
                </div>

                <p className="text-sm text-muted-foreground mb-1">
                    To: <span className="font-medium text-black">Jone Doe (j.doe@gmail.com)</span>
                </p>

                <Textarea
                    className="w-full min-h-[400px] text-sm"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />

                <DialogFooter className="pt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSend}>
                        <Send className="w-4 h-4 mr-2" /> Send Message
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
