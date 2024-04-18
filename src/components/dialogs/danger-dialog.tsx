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
}

const DangerDialog: React.FC<DangerDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={isOpen ? onClose : undefined}>
      <DialogContent
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        className="max-w-xs rounded-lg sm:max-w-md"
      >
        <DialogTitle id="dialog-title">{title}</DialogTitle>
        <DialogDescription id="dialog-description">
          {description}
        </DialogDescription>
        <DialogFooter className="gap-2">
          <Button onClick={onConfirm} className="bg-[#cf000f]">
            Confirm
          </Button>
          <DialogClose asChild>
            <Button onClick={onClose} variant={'outline'}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DangerDialog;
