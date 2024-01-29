import { Dialog, DialogContent, DialogHeader, DialogTitle } from "components/ui/dialog";
import { Edit, PlusCircle } from "lucide-react";

import { Button } from "components/ui/button";
import { Entry } from "model/entry";
import { EntryType, onlyPortfolioBalances } from "model/entryType";
import { DepositForm } from "pages/app/entries/components/DepositForm";
import { FeesForm } from "pages/app/entries/components/FeesForm";
import { TaxesForm } from "pages/app/entries/components/TaxesForm";
import { WithdrawalForm } from "pages/app/entries/components/WithdrawalForm";
import { useState } from "react";

type Props = {
  showEditIcon?: boolean;
};

export const AddPortfolioBalance = ({ showEditIcon }: Props) => {
  const entryTypes = onlyPortfolioBalances();
  const [menuOpen, setMenuOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [entryType, setEntryType] = useState<EntryType>();

  const onFormChange = (data: Entry | undefined) => {
    setFormOpen(false);
    setEntryType(undefined);
  };

  const EntryForm = () => {
    switch (entryType) {
      case EntryType.WITHDRAWAL:
        return <WithdrawalForm onChange={onFormChange} />;
      case EntryType.DEPOSIT:
        return <DepositForm onChange={onFormChange} />;
      case EntryType.TAXES:
        return <TaxesForm onChange={onFormChange} />;
      case EntryType.FEES:
        return <FeesForm onChange={onFormChange} />;
      case undefined:
        return null;
      default:
        throw new Error(`Invalid entry type: ${entryType}`);
    }
  };

  return (
    <div className="flex">
      <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
        {showEditIcon ? (
          <Button variant="ghost" size="sm" onClick={() => setMenuOpen(true)}>
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={() => setMenuOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Balance
          </Button>
        )}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to your portfolio balance</DialogTitle>
          </DialogHeader>
          <span className="flex flex-col space-y-2">
            {entryTypes.map((entryType: any) => (
              <Button
                key={entryType.type}
                className="w-full"
                variant="outline"
                onClick={() => {
                  setMenuOpen(false);
                  setFormOpen(true);
                  setEntryType(entryType.type);
                }}
              >
                <entryType.icon className="mr-2 h-4 w-4" />
                <span className="capitalize">{entryType.type.toLowerCase()}</span>
              </Button>
            ))}
          </span>
        </DialogContent>
      </Dialog>
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{`Add a new ${entryType}`}</DialogTitle>
          </DialogHeader>
          <EntryForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};
