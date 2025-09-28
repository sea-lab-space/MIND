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
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        onOpenChange(true);
      }
    },
    [onOpenChange]
  );

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
          <Button variant="outline" onClick={handleCloseClick}>
            Exit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
