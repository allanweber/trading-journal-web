import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import { Edit, PlusCircle } from "lucide-react";

import { onlyPortfolioBalances } from "model/entryType";
import { NavLink } from "react-router-dom";
import { Button } from "../../../../components/ui/button";

type Props = {
  showEditIcon?: boolean;
};

export const AddPortfolioBalance = ({ showEditIcon }: Props) => {
  const entryTypes = onlyPortfolioBalances();
  return (
    <div className="flex">
      <Dialog>
        <DialogTrigger asChild>
          {showEditIcon ? (
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          ) : (
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Balance
            </Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to your portfolio balance</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <span className="flex flex-col space-y-2">
              {entryTypes.map((entryType: any) => (
                <Button asChild key={entryType.type} className="w-full" variant="outline">
                  <NavLink to={`/trading/entries/new/${entryType.type}`}>
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
