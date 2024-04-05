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
import { Entry, feesSchema } from "model/entry";
import { EntryType } from "model/entryType";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSaveEntry } from "service/entryQueries";

import { DateTimePicker } from "components/DateTimePicker";
import { HelperText } from "components/HelperText";
import { NumberInput } from "components/NumberInput";
import { Textarea } from "components/ui/textarea";
import { usePortfolioContext } from "contexts/PortfolioContext";
import { getSymbol } from "model/currency";

type Props = {
  fees?: Entry;
  onChange: (data: Entry | undefined) => void;
};

export const FeesForm = ({ fees, onChange }: Props) => {
  const { portfolio } = usePortfolioContext();
  const startValues: Entry = {
    notes: "",
    date: new Date(),
    price: 0,
    entryType: EntryType.FEES,
    result: 0,
    portfolio: portfolio!,
  };

  const [values, setValues] = useState<Entry>(fees || startValues);

  const mutation = useSaveEntry(fees?.id);
  const { toast } = useToast();

  useEffect(() => {
    if (fees) {
      setValues(fees);
    }
  }, [fees]);

  const form = useForm<Entry>({
    resolver: zodResolver(feesSchema),
    defaultValues: values,
    values,
  });

  function onSubmit(data: Entry) {
    mutation.mutate(data, {
      onSuccess: (data) => {
        toast({
          title: "Fee saved",
          description: `Fee was saved successfully`,
        });
        onChange(data);
      },
    });
  }

  return (
    <>
      <MessageDisplay message={mutation.error} variant="destructive" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fee Date</FormLabel>
                <DateTimePicker withTime {...field} disabled={fees}>
                  <HelperText>
                    This is the date when you did or will do your fee, this is used to calculate
                    your balance, and can never be changed. (required)
                  </HelperText>
                </DateTimePicker>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fee value</FormLabel>
                <NumberInput
                  {...field}
                  currency={getSymbol(portfolio?.currency || "$")}
                  disabled={fees}
                >
                  <HelperText>
                    This is the value of your fee, this is used to calculate your balance, and can
                    never be changed. (required)
                  </HelperText>
                </NumberInput>
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
                  This is just a brief description of your fee. (optional)
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
