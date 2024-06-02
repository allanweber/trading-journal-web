import { Dialog, DialogContent, DialogHeader, DialogTitle } from "components/ui/dialog";
import { Edit, PlusCircle } from "lucide-react";

import { Button } from "components/ui/button";
import { EntryType, onlyPortfolioBalances } from "model/entryType";
import { Portfolio } from "model/portfolio";
import { useState } from "react";
import { useNavigate } from "react-router";

export const AddPortfolioBalance = ({
  portfolio,
  showEditIcon,
}: {
  portfolio: Portfolio;
  showEditIcon?: boolean;
}) => {
  const entryTypes = onlyPortfolioBalances();
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleClick = (entryType: EntryType) => {
    setMenuOpen(false);
    navigate(`/trading/portfolios/${portfolio.id}/entries/${entryType.toLocaleLowerCase()}/new`);
  };

  return (
    <div className="flex">
      <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
        {showEditIcon ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMenuOpen(true)}
            aria-label="add balance"
            className="px-0"
          >
            <Edit size={20} />
          </Button>
        ) : (
          <Button onClick={() => setMenuOpen(true)} aria-label="add balance" className="gap-2">
            <PlusCircle className="h-6 w-6 md:h-4 md:w-4" />
            <span className="hidden md:block">Add Entry</span>
          </Button>
        )}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to your portfolio balance</DialogTitle>
          </DialogHeader>
          <span className="flex flex-col">
            {entryTypes.map((entryType: any) => (
              <Button
                key={entryType.type}
                className="w-full"
                variant="outline"
                onClick={() => handleClick(entryType.type)}
              >
                <entryType.icon className="mr-2 h-4 w-4" />
                <span className="capitalize">{entryType.type.toLowerCase()}</span>
              </Button>
            ))}
          </span>
        </DialogContent>
      </Dialog>
    </div>
  );
};
