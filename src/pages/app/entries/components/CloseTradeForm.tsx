import { zodResolver } from "@hookform/resolvers/zod";
import DateDisplay from "components/DateDisplay";
import { DateTimePicker } from "components/DateTimePicker";
import { HelperText } from "components/HelperText";
import { MessageDisplay } from "components/MessageDisplay";
import NumberDisplay from "components/NumberDisplay";
import { NumberInput } from "components/NumberInput";
import { PageHeader } from "components/PageHeader";
import { Button } from "components/ui/button";
import { DialogClose } from "components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form";
import { useToast } from "components/ui/use-toast";
import { usePortfolioContext } from "contexts/PortfolioContext";
import { getSymbol } from "model/currency";
import { Entry, ExitEntry, exitEntrySchema } from "model/entry";
import { useForm } from "react-hook-form";
import { useCloseEntry } from "service/entryQueries";

const EntrySummary = ({ entry }: { entry: Entry }) => {
  return (
    <span className="flex flex-col w-full text-muted-foreground text-sm">
      <span className="flex justify-between">
        <span>Open Date</span>
        <span>
          <DateDisplay withTime>{entry.date}</DateDisplay>
        </span>
      </span>
      <span className="flex justify-between">
        <span>Entry Price</span>
        <span>
          <NumberDisplay currency={getSymbol(entry.portfolio.currency)}>
            {entry.price}
          </NumberDisplay>
        </span>
      </span>
      <span className="flex justify-between">
        <span>Entry Size</span>
        <span>
          <NumberDisplay>{entry.size}</NumberDisplay>
        </span>
      </span>
    </span>
  );
};

type Props = {
  entry: Entry;
};

export const CloseTradeForm = ({ entry }: Props) => {
  const { portfolio } = usePortfolioContext();
  const startValues: ExitEntry = {
    exitDate: new Date(),
    exitPrice: 0,
    costs: entry.costs,
  };

  const { toast } = useToast();
  const mutation = useCloseEntry(entry.id!);

  const form = useForm<ExitEntry>({
    resolver: zodResolver(exitEntrySchema),
    defaultValues: startValues,
  });

  function onSubmit(data: ExitEntry) {
    mutation.mutate(data, {
      onSuccess: (entry) => {
        toast({
          title: "Entry Close",
          description: `Entry ${entry.symbol} was successfully closed`,
        });
      },
    });
  }

  return (
    <>
      <MessageDisplay message={mutation.error} variant="destructive" />
      <PageHeader>
        <PageHeader.Title>Close {entry.symbol}</PageHeader.Title>
      </PageHeader>
      <EntrySummary entry={entry} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="exitDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="mb-2">Exit Date</FormLabel>
                <DateTimePicker {...field} withTime>
                  <HelperText>
                    This is the date when you closed your stock trade (optional)
                  </HelperText>
                </DateTimePicker>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="exitPrice"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Exit price</FormLabel>
                <FormControl>
                  <NumberInput {...field} currency={getSymbol(portfolio?.currency || "$")}>
                    <HelperText>
                      This is the price when you closed your stock trade (optional)
                    </HelperText>
                  </NumberInput>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="costs"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Costs</FormLabel>
                <FormControl>
                  <NumberInput {...field} currency={getSymbol(portfolio?.currency || "$")}>
                    <HelperText>This is the costs for this stock trade (optional)</HelperText>
                  </NumberInput>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogClose asChild>
            <div className="flex justify-between">
              <Button type="button" variant="outline" className="w-full">
                Cancel
              </Button>
              <Button type="submit" className="w-full ml-1" disabled={mutation.isPending}>
                Save
              </Button>
            </div>
          </DialogClose>
        </form>
      </Form>
    </>
  );
};
