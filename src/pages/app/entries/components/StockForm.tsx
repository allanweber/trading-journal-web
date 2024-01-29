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
import { Entry, tradeSchema } from "model/entry";
import { EntryType } from "model/entryType";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSaveEntry } from "service/entryQueries";

import { DateTimePicker } from "components/DateTimePicker";
import { DirectionSelect } from "components/DirectionSelect";
import { NumberInput } from "components/NumberInput";
import { PageHeader } from "components/PageHeader";
import { Input } from "components/ui/input";
import { Separator } from "components/ui/separator";
import { Textarea } from "components/ui/textarea";
import { usePortfolioContext } from "contexts/PortfolioContext";
import { getSymbol } from "model/currency";
import { Direction } from "model/direction";
import { NavLink } from "react-router-dom";
import { DeleteEntryButton } from "./DeleteEntryButton";

export const StockForm = ({ stock }: { stock?: Entry }) => {
  const { portfolio } = usePortfolioContext();
  const startValues: Entry = {
    date: new Date(),
    price: 0,
    entryType: EntryType.STOCK,
    symbol: "",
    direction: Direction.Long,
    size: 0,
    notes: "",
    result: 0,
    portfolio: portfolio!,
  };

  const [values, setValues] = useState<Entry>(stock || startValues);
  const [deleteError, setDeleteError] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const mutation = useSaveEntry(stock?.id);

  useEffect(() => {
    if (stock) {
      setValues(stock);
    }
  }, [stock]);

  const form = useForm<Entry>({
    resolver: zodResolver(tradeSchema),
    defaultValues: values,
    values,
  });

  function onSubmit(data: Entry) {
    mutation.mutate(data, {
      onSuccess: (data) => {
        toast({
          title: "Stock saved",
          description: `Stock was saved successfully`,
        });
        navigate("/trading/entries");
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
              <PageHeader.Title>{stock ? "Edit" : "Add a new"} Stock Trade</PageHeader.Title>
              <PageHeader.Action>
                {stock && (
                  <DeleteEntryButton
                    entry={stock as Entry}
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
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-12 md:col-span-6 lg:col-span-4">
                    <FormField
                      control={form.control}
                      name="symbol"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Symbol</FormLabel>
                          <FormControl>
                            <Input placeholder="Stock symbol" {...field} />
                          </FormControl>
                          <FormDescription>
                            This is the stock symbol your are buying or selling. (required)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-12 md:col-span-6 lg:col-span-4">
                    <FormField
                      control={form.control}
                      name="direction"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Direction</FormLabel>
                          <FormControl>
                            <DirectionSelect {...field} />
                          </FormControl>
                          <FormDescription>
                            This is the direction of your stock trade. (required)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-12 md:col-span-6 lg:col-span-4 mt-8">
                    <span className="text-muted-foreground ">Strategy is coming up soon</span>
                  </div>

                  <div className="col-span-12 md:col-span-6 lg:col-span-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="mb-2">Date</FormLabel>

                          <DateTimePicker withTime {...field} disabled={stock} />

                          <FormDescription>
                            This is the date when your stock trade started. (required)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-12 md:col-span-6 lg:col-span-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Price</FormLabel>

                          <FormControl>
                            <NumberInput
                              {...field}
                              disabled={stock}
                              currency={getSymbol(portfolio?.currency || "$")}
                            />
                          </FormControl>

                          <FormDescription>
                            This is the value of your stock trade. (required)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-12 md:col-span-6 lg:col-span-4">
                    <FormField
                      control={form.control}
                      name="size"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Size</FormLabel>

                          <FormControl>
                            <NumberInput {...field} disabled={stock} />
                          </FormControl>

                          <FormDescription>
                            How many shares are you buying or selling. (required)
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-12">
                    <Separator />
                    <h3 className="-ml-1 mt-1">Risk Management</h3>
                  </div>

                  <div className="col-span-12 md:col-span-6 lg:col-span-4">
                    <FormField
                      control={form.control}
                      name="profit"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Take Profit</FormLabel>

                          <FormControl>
                            <NumberInput
                              {...field}
                              currency={getSymbol(portfolio?.currency || "$")}
                            />
                          </FormControl>

                          <FormDescription>
                            This is the value of your take profit (optional)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-12 md:col-span-6 lg:col-span-4">
                    <FormField
                      control={form.control}
                      name="loss"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Stop Loss</FormLabel>

                          <FormControl>
                            <NumberInput
                              {...field}
                              currency={getSymbol(portfolio?.currency || "$")}
                            />
                          </FormControl>

                          <FormDescription>
                            This is the value of your stop loss (optional)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-12 md:col-span-6 lg:col-span-4 mt-8">
                    <span className="text-muted-foreground">
                      Risk reward analysis is coming up soon
                    </span>
                  </div>

                  <div className="col-span-12">
                    <Separator className="mb-3" />
                    <h3 className="-ml-1">Close Stock</h3>
                  </div>

                  <div className="col-span-12 md:col-span-6 lg:col-span-4">
                    <FormField
                      control={form.control}
                      name="exitDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="mb-2">Exit Date</FormLabel>

                          <DateTimePicker {...field} withTime />

                          <FormDescription>
                            This is the date when you closed your stock trade (optional)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-12 md:col-span-6 lg:col-span-4">
                    <FormField
                      control={form.control}
                      name="exitPrice"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Exit price</FormLabel>

                          <FormControl>
                            <NumberInput
                              {...field}
                              currency={getSymbol(portfolio?.currency || "$")}
                            />
                          </FormControl>

                          <FormDescription>
                            This is the price when you closed your stock trade (optional)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-12 md:col-span-6 lg:col-span-4">
                    <FormField
                      control={form.control}
                      name="costs"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Costs</FormLabel>

                          <FormControl>
                            <NumberInput
                              {...field}
                              currency={getSymbol(portfolio?.currency || "$")}
                            />
                          </FormControl>

                          <FormDescription>Costs for this stock trade (optional)</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-12">
                    <Separator className="mb-3" />
                    <h3 className="-ml-1">Additional Information</h3>
                  </div>

                  <div className="col-span-12 sm:col-span-12">
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
                            This is just a brief description of your stock trade. (optional)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
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
            </div>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};
