import { Avatar } from "@radix-ui/react-avatar";
import ColoredNumber from "components/ColoredNumber";
import DateDisplay from "components/DateDisplay";
import NumberDisplay from "components/NumberDisplay";
import { PageHeader } from "components/PageHeader";
import { AvatarFallback } from "components/ui/avatar";
import { Button } from "components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card";
import { AlertCircle, TrashIcon } from "lucide-react";
import { Entry } from "model/entry";
import { EntryType, getEntryType } from "model/entryType";
import { Portfolio } from "model/portfolio";
import React from "react";
import { AddPortfolioBalance } from "./AddPortfolioBalance";

const entries: Partial<Entry>[] = [
  {
    id: "1",
    date: new Date(2024, 1, 24),
    result: 100,
    entryType: EntryType.DEPOSIT,
  },
  {
    id: "2",
    date: new Date(2024, 1, 24),
    result: 125,
    entryType: EntryType.DEPOSIT,
  },
  {
    id: "3",
    date: new Date(2024, 1, 24),
    result: -100,
    entryType: EntryType.WITHDRAWAL,
  },
  {
    id: "4",
    date: new Date(2024, 1, 24),
    result: -10,
    entryType: EntryType.TAXES,
  },
  {
    id: "5",
    date: new Date(2024, 1, 24),
    result: -15,
    entryType: EntryType.FEES,
  },
  {
    id: "6",
    date: new Date(2024, 1, 24),
    result: 200,
    entryType: EntryType.DEPOSIT,
  },
];

const renderIcon = (entryType: EntryType) => {
  const type = getEntryType(entryType);
  if (type) {
    return React.createElement(type.icon, { className: "h-4 w-4" });
  }
  return <AlertCircle color="orange" />;
};

export const PortfolioEntries = ({ portfolio }: { portfolio: Portfolio }) => {
  return (
    <Card className="col-span-4">
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
      <CardContent className="pl-6">
        <div className="space-y-8">
          {entries.map((entry) => (
            <div
              className="flex items-center rounded-md p-1 transition-all hover:cursor-pointer hover:bg-accent hover:text-accent-foreground"
              key={entry.id}
              onClick={() => console.log("select")}
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
              <div className="ml-auto font-medium">
                <div className="flex items-center space-y-2">
                  <div>
                    <ColoredNumber value={entry.result!} className="text-base">
                      <NumberDisplay value={entry.result} currency={portfolio.currency} withSign />
                    </ColoredNumber>
                  </div>
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("delete");
                      }}
                    >
                      <TrashIcon className="h-4 w-4 mb-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
