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
import { Entry, depositSchema } from "model/entry";
import { EntryType } from "model/entryType";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useGetEntry, useSaveEntry } from "service/entryQueries";

import { DateTimePicker } from "components/DateTimePicker";
import { HelperText } from "components/HelperText";
import { NumberInput } from "components/NumberInput";
import { PageHeader } from "components/PageHeader";
import { TableLoading } from "components/table/TableLoading";
import { Textarea } from "components/ui/textarea";
import { getSymbol } from "model/currency";
import { useNavigate, useParams } from "react-router";
import { NavLink } from "react-router-dom";
import { useGetPortfolio } from "service/portfolioQueries";
import { DeleteEntryButton } from "./components/DeleteEntryButton";

export const Deposit = () => {
  const { portfolioId, entryId } = useParams();
  const { data: portfolio } = useGetPortfolio(portfolioId);
  const { data: deposit, error: queryError } = useGetEntry(portfolioId!, entryId);

  const [values, setValues] = useState<Entry>({
    notes: "",
    date: new Date(),
    price: 0,
    entryType: EntryType.DEPOSIT,
    portfolio: portfolio!,
  });
  const [deleteError, setDeleteError] = useState<any>(null);
  const navigate = useNavigate();
  const mutation = useSaveEntry(portfolio?.id!, deposit?.id);
  const { toast } = useToast();

  useEffect(() => {
    if (deposit) {
      setValues(deposit);
    }
  }, [deposit]);

  const form = useForm<Entry>({
    resolver: zodResolver(depositSchema),
    defaultValues: values,
    values,
  });

  console.log(form.formState.errors);

  if (!portfolio) return <TableLoading />;

  function onSubmit(data: Entry) {
    mutation.mutate(data, {
      onSuccess: (data) => {
        toast({
          title: "Deposit saved",
          description: `Deposit was saved successfully`,
        });
        navigate(`/trading/portfolios/${portfolio!.id}/edit`);
      },
    });
  }

  return (
    <>
      <MessageDisplay message={mutation.error} variant="destructive" />
      <MessageDisplay message={deleteError} variant="destructive" />
      <MessageDisplay message={queryError} variant="destructive" />

      <Card>
        <CardHeader>
          <CardTitle>
            <PageHeader>
              <PageHeader.Title>{deposit ? "Edit" : "Add a new"} Deposit</PageHeader.Title>
              <PageHeader.Action>
                {deposit && (
                  <DeleteEntryButton
                    entry={deposit as Entry}
                    onError={(error) => setDeleteError(error)}
                    onSuccess={() => navigate(`/trading/portfolios/${portfolio!.id}/edit`)}
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
                    <DateTimePicker withTime {...field} disabled={deposit}>
                      <HelperText>
                        This is the date when you did or will do your deposit, this is used to
                        calculate your balance, and can never be changed. (required)
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
                    <FormLabel>Deposit value</FormLabel>
                    <NumberInput
                      {...field}
                      currency={getSymbol(portfolio?.currency || "$")}
                      disabled={deposit}
                    >
                      <HelperText>
                        This is the value of your deposit, this is used to calculate your balance,
                        and can never be changed. (required)
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
                      This is just a brief description of your deposit. (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-wrap sm:justify-end">
                <Button asChild variant="outline" className="w-full sm:w-[200px]">
                  <NavLink to={`/trading/portfolios/${portfolio!.id}/edit`}>Cancel</NavLink>
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
