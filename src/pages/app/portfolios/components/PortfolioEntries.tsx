import { Avatar } from "@radix-ui/react-avatar";
import ColoredNumber from "components/ColoredNumber";
import DateDisplay from "components/DateDisplay";
import { MessageDisplay } from "components/MessageDisplay";
import NumberDisplay from "components/NumberDisplay";
import { PageHeader } from "components/PageHeader";
import { TableLoading } from "components/table/TableLoading";
import { AvatarFallback } from "components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "components/ui/dialog";
import { AlertCircle } from "lucide-react";
import { Entry } from "model/entry";
import { EntryType, getEntryType } from "model/entryType";
import { Portfolio } from "model/portfolio";
import { DeleteEntryButton } from "pages/app/entries/components/DeleteEntryButton";
import { DepositForm } from "pages/app/entries/components/DepositForm";
import { FeesForm } from "pages/app/entries/components/FeesForm";
import { TaxesForm } from "pages/app/entries/components/TaxesForm";
import { WithdrawalForm } from "pages/app/entries/components/WithdrawalForm";
import React, { useState } from "react";
import { useGetPortfolioEntries } from "service/entryQueries";
import { AddPortfolioBalance } from "./AddPortfolioBalance";

const renderIcon = (entryType: EntryType) => {
  const type = getEntryType(entryType);
  if (type) {
    return React.createElement(type.icon, { className: "h-4 w-4" });
  }
  return <AlertCircle color="orange" />;
};

export const PortfolioEntries = ({ portfolio }: { portfolio: Portfolio }) => {
  const [deleteError, setDeleteError] = useState<any>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [entry, setEntry] = useState<Entry>();

  const { data: entries, error, isLoading, isSuccess } = useGetPortfolioEntries();

  const onFormChange = (data: Entry | undefined) => {
    setFormOpen(false);
    setEntry(undefined);
  };

  const EntryForm = () => {
    switch (entry?.entryType) {
      case EntryType.WITHDRAWAL:
        return <WithdrawalForm onChange={onFormChange} withdrawal={entry} />;
      case EntryType.DEPOSIT:
        return <DepositForm onChange={onFormChange} deposit={entry} />;
      case EntryType.TAXES:
        return <TaxesForm onChange={onFormChange} taxes={entry} />;
      case EntryType.FEES:
        return <FeesForm onChange={onFormChange} fees={entry} />;
      case undefined:
        return null;
      default:
        throw new Error(`Invalid entry type: ${entry}`);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <PageHeader>
              <PageHeader.Title>Balances</PageHeader.Title>
              <PageHeader.Action>
                <AddPortfolioBalance />
              </PageHeader.Action>
            </PageHeader>
          </CardTitle>
          <CardDescription>Summary of your manual entries</CardDescription>
        </CardHeader>
        <CardContent className="pl-2 md:pl-6 pr-1">
          <MessageDisplay message={error} variant="destructive" />
          <MessageDisplay message={deleteError} variant="destructive" />
          <div className="space-y-8">
            {isLoading ? (
              <TableLoading />
            ) : (
              isSuccess &&
              entries.map((entry) => (
                <div
                  className="flex items-center pt-1 pb-1 rounded-md transition-all hover:cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  key={entry.id}
                  onClick={() => {
                    setFormOpen(true);
                    setEntry(entry);
                  }}
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{renderIcon(entry.entryType!)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      <DateDisplay value={entry.date} />
                    </p>
                    <p className="text-sm text-muted-foreground lowercase">{entry.entryType}</p>
                  </div>
                  <div className="ml-auto">
                    {entry.notes && (
                      <span className="hidden sm:flex mr-1 text-sm text-muted-foreground">
                        There are notes
                      </span>
                    )}
                  </div>
                  <div className="ml-auto font-medium">
                    <div className="flex items-center">
                      <div>
                        <ColoredNumber value={entry.result!}>
                          <NumberDisplay
                            value={entry.result}
                            currency={portfolio.currency}
                            withSign
                          />
                        </ColoredNumber>
                      </div>
                      <div className="ml-1" onClick={(e) => e.stopPropagation()}>
                        <DeleteEntryButton
                          entry={entry}
                          onError={setDeleteError}
                          onSuccess={() => {}}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{`Edit ${entry?.entryType}`}</DialogTitle>
          </DialogHeader>
          <EntryForm />
        </DialogContent>
      </Dialog>
    </>
  );
};
