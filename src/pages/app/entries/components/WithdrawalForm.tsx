import { zodResolver } from "@hookform/resolvers/zod";
import { MessageDisplay } from "components/MessageDisplay";
import { Button } from "components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";
import { useToast } from "components/ui/use-toast";
import { Entry, withdrawalSchema } from "model/entry";
import { EntryType } from "model/entryType";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSaveEntry } from "service/entryQueries";

import { DateTimePicker } from "components/DateTimePicker";
import { NumberInput } from "components/NumberInput";
import { Textarea } from "components/ui/textarea";
import { usePortfolioContext } from "contexts/PortfolioContext";
import { getSymbol } from "model/currency";

type Props = {
  withdrawal?: Entry;
  onChange: (data: Entry | undefined) => void;
};

export const WithdrawalForm = ({ withdrawal, onChange }: Props) => {
  const { portfolio } = usePortfolioContext();
  const startValues: Entry = {
    notes: "",
    date: new Date(),
    price: 0,
    entryType: EntryType.WITHDRAWAL,
    result: 0,
    portfolio: portfolio!,
  };

  const [values, setValues] = useState<Entry>(withdrawal || startValues);
  const [deleteError, setDeleteError] = useState<any>(null);
  const { toast } = useToast();

  const mutation = useSaveEntry(withdrawal?.id);

  useEffect(() => {
    if (withdrawal) {
      setValues(withdrawal);
    }
  }, [withdrawal]);

  const form = useForm<Entry>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: values,
    values,
  });

  function onSubmit(data: Entry) {
    mutation.mutate(data, {
      onSuccess: (data) => {
        toast({
          title: "Withdrawal saved",
          description: `Withdrawal was saved successfully`,
        });
        onChange(data);
      },
    });
  }

  return (
    <>
      <MessageDisplay message={mutation.error} variant="destructive" />
      <MessageDisplay message={deleteError} variant="destructive" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Withdrawal Date</FormLabel>
                <DateTimePicker withTime {...field} disabled={withdrawal} />
                <FormDescription>
                  This is the date when you did or will do your withdrawal, this is used to
                  calculate your balance, and can never be changed. (required)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Withdrawal value</FormLabel>
                <NumberInput
                  {...field}
                  currency={getSymbol(portfolio?.currency || "$")}
                  disabled={withdrawal}
                />
                <FormDescription>
                  This is the value of your withdrawal, this is used to calculate your balance, and
                  can never be changed. (required)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Notes" {...field} />
                </FormControl>
                <FormDescription>
                  This is just a brief description of your withdrawal. (optional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => onChange(undefined)}
            >
              Cancel
            </Button>
            <Button type="submit" className="w-full ml-1" disabled={mutation.isPending}>
              Save
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
