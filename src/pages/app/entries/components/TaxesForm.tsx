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
import { Entry, Taxes, taxesSchema } from "model/entry";
import { EntryType } from "model/entryType";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSaveEntry } from "service/entryQueries";

import { DateTimePicker } from "components/DateTimePicker";
import { NumberInput } from "components/NumberInput";
import { PageHeader } from "components/PageHeader";
import { TextArea } from "components/TextArea";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { usePortfolioContext } from "contexts/PortfolioContext";
import { getSymbol } from "model/currency";
import { DeleteEntryButton } from "./DeleteEntryButton";

type Props = {
  taxes?: Taxes;
  onChange: (data: Taxes | undefined) => void;
};

export const TaxesForm = ({ taxes, onChange }: Props) => {
  const startValues: Taxes = {
    notes: "",
    date: new Date(),
    price: 0,
    entryType: EntryType.TAXES,
  };

  const { portfolio } = usePortfolioContext();
  const [values, setValues] = useState<Taxes>(taxes || startValues);
  const [deleteError, setDeleteError] = useState<any>(null);
  const { toast } = useToast();

  const mutation = useSaveEntry();

  useEffect(() => {
    if (taxes) {
      setValues(taxes);
    }
  }, [taxes]);

  const form = useForm<Taxes>({
    resolver: zodResolver(taxesSchema),
    defaultValues: values,
    values,
  });

  function onSubmit(data: Taxes) {
    mutation.mutate(data, {
      onSuccess: (data) => {
        toast({
          title: "Taxes saved",
          description: `Your taxes were saved successfully`,
        });
        onChange(data);
      },
    });
  }

  return (
    <>
      <MessageDisplay message={mutation.error} variant="destructive" />
      <MessageDisplay message={deleteError} variant="destructive" />
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>
            <PageHeader>
              <PageHeader.Title>{taxes ? "Edit" : "Add a new"} Tax</PageHeader.Title>
              <PageHeader.Action>
                {taxes && (
                  <DeleteEntryButton
                    entry={taxes as Entry}
                    onError={(error) => setDeleteError(error)}
                    onSuccess={() => onChange(undefined)}
                  />
                )}
              </PageHeader.Action>
            </PageHeader>
          </CardTitle>
        </CardHeader>
        <CardContent className="pl-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Taxes Date</FormLabel>
                    <DateTimePicker withTime {...field} disabled={taxes} />
                    <FormDescription>
                      This is the date when you declared your taxes, this is used to calculate your
                      balance, and can never be changed. (required)
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
                    <FormLabel>Taxes value</FormLabel>
                    <NumberInput
                      disabled={taxes}
                      {...field}
                      currency={getSymbol(portfolio?.currency || "$")}
                    />
                    <FormDescription>
                      This is the value of your taxes, this is used to calculate your balance, and
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
                      <TextArea placeholder="Notes" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is just a brief description of your taxes. (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-wrap sm:justify-end">
                <Button
                  variant="outline"
                  className="w-full sm:w-[200px]"
                  onClick={() => onChange(undefined)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full mt-2 sm:w-[200px] sm:ml-3 sm:mt-0"
                  disabled={mutation.isPending}
                >
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};
