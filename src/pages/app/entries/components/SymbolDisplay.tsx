import { Button } from "components/ui/button";
import { useToast } from "components/ui/use-toast";
import { cn } from "lib/utils";
import { CandlestickChart } from "lucide-react";
import { Entry } from "model/entry";
import { EntryType } from "model/entryType";

type Props = {
  entry: Entry;
  className?: string;
};

export const SymbolDisplay = ({ entry, className }: Props) => {
  /* TODO: on click open chart */
  const { toast } = useToast();

  const showChart = (e: any) => {
    e.stopPropagation();
    toast({
      title: "Display Chart",
      description: `Display chart is coming soon in a future release.`,
    });
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
