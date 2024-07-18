import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Button } from '~/components/buttons';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '.';

interface DangerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  triggerButtonRef: React.RefObject<HTMLButtonElement>;
}

const DangerDialog = forwardRef<HTMLDivElement, DangerDialogProps>(
  ({ isOpen, onClose, onConfirm, title, description, triggerButtonRef }, ref) => {
    const localRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => localRef.current!);

    const handleOnClose = () => {
      onClose();
      if (triggerButtonRef.current) {
        triggerButtonRef.current.focus();
      }
    };

    return (
    <Dialog open={isOpen} onOpenChange={isOpen ? handleOnClose : undefined}>
      <DialogContent
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        className="max-w-xs rounded-lg sm:max-w-md"
        ref={localRef}
      >
        <DialogTitle id="dialog-title">{title}</DialogTitle>
        <DialogDescription id="dialog-description">
          {description}
        </DialogDescription>
        <DialogFooter className="gap-2">
          <Button
            autoFocus
            onClick={onConfirm}
            className="bg-[#cf000f]"
            aria-label="Confirm deletion"
          >
            Confirm
          </Button>
          <DialogClose asChild>
            <Button
              onClick={onClose}
              variant={'outline'}
              aria-label="Cancel deletion"
            >
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
);

export default DangerDialog;
