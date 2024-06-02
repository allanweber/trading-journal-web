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
} from "components/ui/alert-dialog";
import { Button } from "components/ui/button";
import { useToast } from "components/ui/use-toast";
import { TrashIcon } from "lucide-react";
import { Entry } from "model/entry";
import { EntryType } from "model/entryType";
import { useDeleteEntry } from "service/entryQueries";

type Props = {
  entry: Entry;
  onError: (error: any) => void;
  onSuccess: () => void;
  withLabel?: boolean;
};

export const DeleteEntryButton = ({ entry, onError, onSuccess, withLabel }: Props) => {
  const mutation = useDeleteEntry(entry.portfolio.id!);
  const { toast } = useToast();

  if (mutation.isPending) {
    return <>Deleting...</>;
  }
  if (mutation.isError) {
    onError(mutation.error);
  }

  const confirm = () => {
    mutation.mutate(entry.id!, {
      onSuccess: () => {
        toast({
          title: "Entry Deleted",
          description: `Entry ${
            entry.entryType === EntryType.STOCK ? entry.symbol : entry.entryType
          } from portfolio ${entry.portfolio.name} was deleted successfully`,
        });
        onSuccess();
      },
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {withLabel ? (
          <Button variant="link" aria-label="delete entry" className="gap-2">
            <TrashIcon className="h-6 w-6 sm:h-4 sm:w-4 " />
            Delete
          </Button>
        ) : (
          <TrashIcon
            className="h-6 w-6 sm:h-4 sm:w-4 hover:scale-150 hover:cursor-pointer"
            aria-label="delete entry"
          />
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {`This will permanently delete the entry "${
              entry.entryType === EntryType.STOCK ? entry.symbol : entry.entryType
            }" from portfolio ${entry.portfolio.name}, and remove all of its data.`}
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
