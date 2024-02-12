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
import { toast } from "components/ui/use-toast";
import { usePortfolioContext } from "contexts/PortfolioContext";
import { TrashIcon } from "lucide-react";
import { Portfolio } from "model/portfolio";
import { useNavigate } from "react-router-dom";
import { useDeletePortfolio } from "service/portfolioQueries";

type Props = {
  portfolio: Portfolio;
  onError: (error: any) => void;
};

export const DeletePortfolioButton = ({ portfolio, onError }: Props) => {
  const mutation = useDeletePortfolio();
  const navigate = useNavigate();
  const { setPortfolio } = usePortfolioContext();

  if (mutation.isPending) {
    return <div>Deleting...</div>;
  }
  if (mutation.isError) {
    onError(mutation.error);
  }

  const confirm = () => {
    mutation.mutate(portfolio.id!, {
      onSuccess: () => {
        toast({
          title: "Portfolio Deleted",
          description: `Your Portfolio ${portfolio.name} was deleted successfully`,
        });
        setPortfolio(undefined);
        navigate("/trading/portfolios");
      },
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <TrashIcon
          aria-label="delete portfolio"
          className="h-4 w-4 hover:scale-150 hover:cursor-pointer"
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {`This will permanently delete the portfolio "${portfolio.name}", and remove all of its data and entries.`}
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
