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
import { toast } from "components/ui/use-toast";
import { TrashIcon } from "lucide-react";
import { Entry } from "model/entry";
import { EntryType } from "model/entryType";
import { useDeleteEntry } from "service/entryQueries";

type Props = {
  entry: Entry;
  onError: (error: any) => void;
  onSuccess: () => void;
};

export const DeleteEntryButton = ({ entry, onError, onSuccess }: Props) => {
  const mutation = useDeleteEntry();

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
          title: "Entry Deleted",
          description: `Entry ${
            entry.entryType === EntryType.STOCK ? entry.symbol : entry.entryType
          } from portfolio ${entry.portfolio.name} was deleted successfully`,
        });
        onSuccess();
      },
    });
  };

  console.log("entry", entry);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <TrashIcon className="mr-2 h-4 w-4" />
        </Button>
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
