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
import { Entry, Withdrawal, withdrawalSchema } from "model/entry";
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
  withdrawal?: Withdrawal;
  onChange: (data: Withdrawal | undefined) => void;
};

export const WithdrawalForm = ({ withdrawal, onChange }: Props) => {
  const startValues: Withdrawal = {
    notes: "",
    date: new Date(),
    price: 0,
    entryType: EntryType.WITHDRAWAL,
  };

  const { portfolio } = usePortfolioContext();
  const [values, setValues] = useState<Withdrawal>(withdrawal || startValues);
  const [deleteError, setDeleteError] = useState<any>(null);
  const { toast } = useToast();

  const mutation = useSaveEntry();

  useEffect(() => {
    if (withdrawal) {
      setValues(withdrawal);
    }
  }, [withdrawal]);

  const form = useForm<Withdrawal>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: values,
    values,
  });

  function onSubmit(data: Withdrawal) {
    mutation.mutate(data, {
      onSuccess: (data) => {
        toast({
          title: "Withdrawal saved",
          description: `Your withdrawal was saved successfully`,
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
              <PageHeader.Title>{withdrawal ? "Edit" : "Add a new"} Withdrawal</PageHeader.Title>
              <PageHeader.Action>
                {withdrawal && (
                  <DeleteEntryButton
                    entry={withdrawal as Entry}
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
                      disabled={withdrawal}
                      {...field}
                      currency={getSymbol(portfolio?.currency || "$")}
                    />
                    <FormDescription>
                      This is the value of your withdrawal, this is used to calculate your balance,
                      and can never be changed. (required)
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
                      This is just a brief description of your withdrawal. (optional)
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
