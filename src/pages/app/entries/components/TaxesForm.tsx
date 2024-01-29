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
import { Entry, taxesSchema } from "model/entry";
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
  taxes?: Entry;
  onChange: (data: Entry | undefined) => void;
};

export const TaxesForm = ({ taxes, onChange }: Props) => {
  const { portfolio } = usePortfolioContext();
  const startValues: Entry = {
    notes: "",
    date: new Date(),
    price: 0,
    entryType: EntryType.TAXES,
    result: 0,
    portfolio: portfolio!,
  };

  const [values, setValues] = useState<Entry>(taxes || startValues);
  const { toast } = useToast();

  const mutation = useSaveEntry(taxes?.id);

  useEffect(() => {
    if (taxes) {
      setValues(taxes);
    }
  }, [taxes]);

  const form = useForm<Entry>({
    resolver: zodResolver(taxesSchema),
    defaultValues: values,
    values,
  });

  function onSubmit(data: Entry) {
    mutation.mutate(data, {
      onSuccess: (data) => {
        toast({
          title: "Tax saved",
          description: `Tax were saved successfully`,
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
                <FormLabel>Taxes Date</FormLabel>
                <DateTimePicker withTime {...field} disabled={taxes}>
                  <HelperText>
                    This is the date when you declared your taxes, this is used to calculate your
                    balance, and can never be changed. (required)
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
                <FormLabel>Taxes value</FormLabel>
                <NumberInput
                  {...field}
                  currency={getSymbol(portfolio?.currency || "$")}
                  disabled={taxes}
                >
                  <HelperText>
                    This is the value of your taxes, this is used to calculate your balance, and can
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
                  This is just a brief description of your taxes. (optional)
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
