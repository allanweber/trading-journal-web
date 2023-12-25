import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from 'components/ui/alert-dialog';
import { Button } from 'components/ui/button';
import { toast } from 'components/ui/use-toast';
import { TrashIcon } from 'lucide-react';
import { Entry } from 'model/entry';
import { EntryType } from 'model/entryType';
import { useNavigate } from 'react-router-dom';
import { useDeleteEntry } from 'service/entryQueries';

type Props = {
  entry: Entry;
  onError: (error: any) => void;
};

export const DeleteEntryButton = ({ entry, onError }: Props) => {
  const mutation = useDeleteEntry();
  const navigate = useNavigate();

  if (mutation.isPending) {
    return <div>Deleting...</div>;
  }
  if (mutation.isError) {
    onError(mutation.error);
  }

  const confirm = () => {
    mutation.mutate(entry.id!, {
      onSuccess: () => {
        toast({
          title: 'Entry Deleted',
          description: `Entry ${
            entry.entryType === EntryType.Trade ? entry.symbol : entry.entryType
          } from journal ${entry.journal.name} was deleted successfully`,
        });
        navigate('/trading/entries');
      },
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-[150px]" size="sm">
          <TrashIcon className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {`This will permanently delete the entry "${
              entry.entryType === EntryType.Trade
                ? entry.symbol
                : entry.entryType
            }" from journal ${entry.journal.name}, and remove all of its data.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
