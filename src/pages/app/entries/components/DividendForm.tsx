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
import { Entry, dividendSchema } from "model/entry";
import { EntryType } from "model/entryType";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSaveEntry } from "service/entryQueries";

import { DateTimePicker } from "components/DateTimePicker";
import { HelperText } from "components/HelperText";
import { NumberInput } from "components/NumberInput";
import { PageHeader } from "components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Input } from "components/ui/input";
import { Textarea } from "components/ui/textarea";
import { usePortfolioContext } from "contexts/PortfolioContext";
import { getSymbol } from "model/currency";
import { NavLink, useNavigate } from "react-router-dom";
import { DeleteEntryButton } from "./DeleteEntryButton";

type Props = {
  dividend?: Entry;
};

export default function DividendForm({ dividend }: Props) {
  const { portfolio } = usePortfolioContext();
  const startValues: Entry = {
    symbol: "",
    notes: "",
    date: new Date(),
    price: 0,
    entryType: EntryType.DIVIDEND,
    result: 0,
    portfolio: portfolio!,
  };
  const [values, setValues] = useState<Entry>(dividend || startValues);
  const [deleteError, setDeleteError] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const mutation = useSaveEntry(dividend?.id);

  useEffect(() => {
    if (dividend) {
      setValues(dividend);
    }
  }, [dividend]);

  const form = useForm<Entry>({
    resolver: zodResolver(dividendSchema),
    defaultValues: values,
    values,
  });

  function onSubmit(data: Entry) {
    mutation.mutate(data, {
      onSuccess: (data) => {
        toast({
          title: "Dividend saved",
          description: `Dividend was saved successfully`,
        });
        navigate("/trading/entries");
      },
    });
  }

  return (
    <>
      <MessageDisplay message={mutation.error} variant="destructive" />
      <MessageDisplay message={deleteError} variant="destructive" />
      <Card>
        <CardHeader>
          <CardTitle>
            <PageHeader>
              <PageHeader.Title>{dividend ? "Edit" : "Add a new"} Dividend</PageHeader.Title>
              <PageHeader.Action>
                {dividend && (
                  <DeleteEntryButton
                    entry={dividend as Entry}
                    onError={(error) => setDeleteError(error)}
                    onSuccess={() => navigate("/trading/entries")}
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
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dividend Symbol</FormLabel>
                    <FormControl>
                      <Input placeholder="Dividend Symbol" {...field}>
                        <HelperText>
                          This is the trade symbol from where you received your dividend. (required)
                        </HelperText>
                      </Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Dividend Date</FormLabel>
                    <DateTimePicker withTime {...field} disabled={dividend}>
                      <HelperText>
                        This is the date when you received do your dividend, this is used to
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
                    <FormLabel>Dividend value</FormLabel>
                    <NumberInput
                      {...field}
                      currency={getSymbol(portfolio?.currency || "$")}
                      disabled={dividend}
                    >
                      <HelperText>
                        This is the value of your dividend, this is used to calculate your balance,
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
                      This is just a brief description of your dividend. (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-wrap sm:justify-end">
                <Button asChild variant="outline" className="w-full sm:w-[200px]">
                  <NavLink to="/trading/entries">Cancel</NavLink>
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
}
