import { Button } from "components/ui/button";
import { cn } from "lib/utils";
import { CandlestickChart } from "lucide-react";
import { Entry } from "model/entry";
import { EntryType } from "model/entryType";

type Props = {
  entry: Entry;
  className?: string;
};

export const SymbolDisplay = ({ entry, className }: Props) => {
  const showChart = (e: any) => {
    e.stopPropagation();
  };

  if (!entry.symbol) return <></>;
  if (entry.entryType === EntryType.DIVIDEND) return <span>{`${entry.symbol} (Dividend)`}</span>;

  return (
    <Button variant="link" className={cn(className)} onClick={(e) => showChart(e)}>
      {entry.symbol}
      <CandlestickChart className="h-4 w-4 ml-1" />
    </Button>
  );
};
