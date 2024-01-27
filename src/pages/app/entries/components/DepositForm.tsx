import { zodResolver } from "@hookform/resolvers/zod";
import { MessageDisplay } from "components/MessageDisplay";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
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
import { Deposit, Entry, depositSchema } from "model/entry";
import { EntryType } from "model/entryType";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSaveEntry } from "service/entryQueries";

import { DateTimePicker } from "components/DateTimePicker";
import { NumberInput } from "components/NumberInput";
import { PageHeader } from "components/PageHeader";
import { TextArea } from "components/TextArea";
import { usePortfolioContext } from "contexts/PortfolioContext";
import { getSymbol } from "model/currency";
import { DeleteEntryButton } from "./DeleteEntryButton";

type Props = {
  deposit?: Deposit;
  onChange: (data: Deposit | undefined) => void;
};

export const DepositForm = ({ deposit, onChange }: Props) => {
  const startValues: Deposit = {
    notes: "",
    date: new Date(),
    price: 0,
    entryType: EntryType.DEPOSIT,
  };

  const { portfolio } = usePortfolioContext();
  const [values, setValues] = useState<Deposit>(deposit || startValues);
  const [deleteError, setDeleteError] = useState<any>(null);
  const { toast } = useToast();

  const mutation = useSaveEntry();

  useEffect(() => {
    if (deposit) {
      setValues(deposit);
    }
  }, [deposit]);

  const form = useForm<Deposit>({
    resolver: zodResolver(depositSchema),
    defaultValues: values,
    values,
  });

  function onSubmit(data: Deposit) {
    mutation.mutate(data, {
      onSuccess: (data) => {
        toast({
          title: "Deposit saved",
          description: `Your deposit was saved successfully`,
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
              <PageHeader.Title>{deposit ? "Edit" : "Add a new"} Deposit</PageHeader.Title>
              <PageHeader.Action>
                {deposit && (
                  <DeleteEntryButton
                    entry={deposit as Entry}
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
                    <FormLabel>Deposit Date</FormLabel>
                    <DateTimePicker withTime {...field} disabled={deposit} />
                    <FormDescription>
                      This is the date when you did or will do your deposit, this is used to
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
                    <FormLabel>Deposit value</FormLabel>
                    <NumberInput
                      disabled={deposit}
                      {...field}
                      currency={getSymbol(portfolio?.currency || "$")}
                    />

                    <FormDescription>
                      This is the value o5 your deposit, this is used to calculate your balance, and
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
                      This is just a brief description of your deposit. (optional)
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
