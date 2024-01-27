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
import { NavLink } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";

export const AddEntryButton = () => {
  const entryTypes = onlyTrades();
  return (
    <>
      <div className="flex md:hidden">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Entry
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add by type</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <div className="flex flex-col space-y-2">
                {entryTypes.map((entryType: any) => (
                  <Button asChild key={entryType.type} className="w-full" variant="outline">
                    <NavLink to={`/trading/entries/new/${entryType.type}`}>
                      <entryType.icon className="mr-2 h-4 w-4" />
                      <span className="capitalize">{entryType.type.toLowerCase()}</span>
                    </NavLink>
                  </Button>
                ))}
              </div>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      </div>
      <div className="hidden md:flex">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Entry
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Add by type</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {entryTypes.map((entryType: any) => (
              <DropdownMenuItem key={entryType.type} asChild>
                <NavLink to={`/trading/entries/new/${entryType.type}`}>
                  <entryType.icon className="mr-2 h-4 w-4" />
                  <span className="capitalize">{entryType.type.toLowerCase()}</span>
                </NavLink>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
