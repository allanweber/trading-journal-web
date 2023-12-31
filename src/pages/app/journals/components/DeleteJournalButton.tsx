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
import { Journal } from 'model/journal';
import { useNavigate } from 'react-router-dom';
import { useDeleteJournal } from 'service/journalQueries';

type Props = {
  journal: Journal;
  onError: (error: any) => void;
};

export const DeleteJournalButton = ({ journal, onError }: Props) => {
  const mutation = useDeleteJournal();
  const navigate = useNavigate();

  if (mutation.isPending) {
    return <div>Deleting...</div>;
  }
  if (mutation.isError) {
    onError(mutation.error);
  }

  const confirm = () => {
    mutation.mutate(journal.id!, {
      onSuccess: () => {
        toast({
          title: 'Journal Deleted',
          description: `Your journal ${journal.name} was deleted successfully`,
        });
        navigate('/trading/journals');
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
            {`This will permanently delete the journal "${journal.name}", and remove all of its data and entries.`}
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
