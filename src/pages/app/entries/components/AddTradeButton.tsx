import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { onlyTrades } from "model/entryType";
import { NavLink, useParams } from "react-router-dom";
import { Button } from "../../../../components/ui/button";

export const AddTradeButton = () => {
  const { portfolioId } = useParams();
  const entryTypes = onlyTrades();
  return (
    <div className="flex">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Add Trade</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add by type</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <span className="flex flex-col space-y-2">
              {entryTypes.map((entryType: any) => (
                <Button asChild key={entryType.type} className="w-full" variant="outline">
                  <NavLink
                    to={`/trading/portfolios/${portfolioId}/entries/${entryType.type.toLowerCase()}/new`}
                  >
                    <entryType.icon className="mr-2 h-4 w-4" />
                    <span className="capitalize">{entryType.type.toLowerCase()}</span>
                  </NavLink>
                </Button>
              ))}
            </span>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};
