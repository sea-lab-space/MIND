import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import type { SuggestedActivity } from "@/types/dataTypes";

type PatientCommunicationProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedInsights: string[]
  selectedActivities: SuggestedActivity[]
  patientName: string
  clinicianName: string
};

export default function PatientMessageDialog({
  open,
  onOpenChange,
  selectedInsights,
  selectedActivities,
  patientName,
  clinicianName,
}: PatientCommunicationProps) {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    setMessage(
      `Dear ${patientName},

This communication outlines observations derived from your recent activity data and provides evidence-based strategies to support your well-being.

We have noted:
${selectedInsights
  .map((insight, index) => `${index + 1}. ${insight}`)
  .join("\n")}

To further support your progress, we recommend the implementation of the following strategies:
${selectedActivities
  .map((activity, index) => `${index + 1}. ${activity.header}: ${activity.description}`)
  .join("\n")}

We encourage you to integrate these into your daily routine and observe their effects. Incremental, consistent actions can lead to meaningful improvements.

Sincerely,
Dr. ${clinicianName}`
    );
    
  }, [selectedInsights, selectedActivities, patientName, clinicianName])

  const handleSend = () => {
    console.log("Sending message:", message);
    // You can connect this to your backend logic
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={{ width: "900px", maxWidth: "90vw" }}
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center">
          <DialogTitle className="text-xl font-semibold">
            Patient Communication Message
          </DialogTitle>
        </div>

        <p className="text-sm text-muted-foreground mb-1">
          To:{" "}
          <span className="font-medium text-black">
            {patientName} (
            {patientName.trim().toLowerCase().replace(/\s+/g, ".")}@gmail.com)
          </span>
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
