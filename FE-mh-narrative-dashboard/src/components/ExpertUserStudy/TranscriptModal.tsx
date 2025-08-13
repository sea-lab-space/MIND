import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import ClinicalNotesTab from "@/components/BaseLine/ClinicalNotes/ClinicalNotesTab";
import { getVisualizerDataForPerson } from "@/utils/dataConversion";
import { Button } from "../ui/button";

type TranscriptModalProps = {
  selectedPatient: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function TranscriptModal({
  selectedPatient,
  open,
  onOpenChange,
}: TranscriptModalProps) {
  const { session_subjective_info } =
    getVisualizerDataForPerson(selectedPatient);

  const [secondModalOpen, setSecondModalOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setSecondModalOpen(false); // reset second modal if first modal is opened
      // Blur focused element after modal opens
      setTimeout(() => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }, 0);
    }
  }, [open]);

  // Handle first modal open state change (like user clicking close)
  const handleFirstModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Instead of closing first modal, open second modal
      setSecondModalOpen(true);
      // Don't call onOpenChange(false) yet to keep first modal open
    } else {
      onOpenChange(true); // allow opening normally
    }
  };

  // Called when user confirms in second modal to close both
  const handleConfirmStart = () => {
    setSecondModalOpen(false);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleFirstModalOpenChange}>
        <DialogTrigger asChild>
          <></>
        </DialogTrigger>
        <DialogContent className="!max-w-6xl w-[1100px] max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Clinical Notes</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <div className="mt-2">
            <ClinicalNotesTab
              showOverviewCardData={false}
              clinicalNotesFacts={session_subjective_info}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={secondModalOpen} onOpenChange={setSecondModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you prepared to start the study?</DialogTitle>
            <DialogClose onClick={() => setSecondModalOpen(false)} />
          </DialogHeader>
          <div className="mt-2">
            <p>
              Click confirm to start the study, the timer will start
              immediately.
            </p>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                type="button"
                variant="destructive"
                onClick={handleConfirmStart}
              >
                Start
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
