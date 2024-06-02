import { Avatar } from "@radix-ui/react-avatar";
import ColoredNumber from "components/ColoredNumber";
import DateDisplay from "components/DateDisplay";
import { MessageDisplay } from "components/MessageDisplay";
import NumberDisplay from "components/NumberDisplay";
import { PageHeader } from "components/PageHeader";
import { TableLoading } from "components/table/TableLoading";
import { AvatarFallback } from "components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card";
import { AlertCircle } from "lucide-react";
import { Entry } from "model/entry";
import { EntryType, getEntryType } from "model/entryType";
import { Portfolio } from "model/portfolio";
import { DeleteEntryButton } from "pages/app/entries/components/DeleteEntryButton";
import React, { useState } from "react";
import { useNavigate } from "react-router";
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
  const { data: entries, error, isLoading, isSuccess } = useGetPortfolioEntries(portfolio.id!);
  const navigate = useNavigate();

  const handleClick = (entry: Entry) => {
    navigate(
      `/trading/portfolios/${portfolio.id}/entries/${entry.entryType.toLocaleLowerCase()}/${
        entry.id
      }`
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <PageHeader>
              <PageHeader.Title>Portfolio Entries</PageHeader.Title>
              <PageHeader.Action>
                {isSuccess && entries.length > 0 && <AddPortfolioBalance portfolio={portfolio} />}
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
            ) : isSuccess && entries.length > 0 ? (
              isSuccess &&
              entries.map((entry, index) => (
                <div
                  aria-label={`entry-${index}`}
                  className="flex items-center pt-1 pb-1 rounded-md transition-all hover:cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  key={entry.id}
                  onClick={() => {
                    handleClick(entry);
                  }}
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{renderIcon(entry.entryType!)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      <DateDisplay>{entry.date}</DateDisplay>
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
                          <NumberDisplay currency={portfolio.currency} withSign>
                            {entry.result}
                          </NumberDisplay>
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
            ) : (
              <div className="flex flex-1 flex-col gap-4 p-2 md:p-4">
                <div className="rounded-lg border border-dashed shadow-sm py-10">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <h3 className="text-2xl font-bold tracking-tight">
                      You have no manual entries
                    </h3>
                    <p className="text-sm text-muted-foreground px-2">
                      You can entries such deposits, withdrawals, fees, and taxes to keep track of
                      your portfolio.
                    </p>
                    <div className="mt-4">
                      <AddPortfolioBalance portfolio={portfolio} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
