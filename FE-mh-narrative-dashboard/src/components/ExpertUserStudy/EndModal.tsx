import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface StudyEndModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudyEndModal({ open, onOpenChange }: StudyEndModalProps) {
  // Custom handler: only allow open or explicit close (via button)
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      // Allow opening
      if (nextOpen) {
        onOpenChange(true);
      }
      // Prevent closing by backdrop or escape
      // Do nothing if nextOpen === false
    },
    [onOpenChange]
  );

  // Function to close explicitly from button
  const handleCloseClick = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} modal>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Study End</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          Please wait for the study coordinator for the next instructions.
        </div>
        <DialogFooter>
          {/* Close button triggers explicit close */}
          <Button variant="outline" onClick={handleCloseClick}>
            Exit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
