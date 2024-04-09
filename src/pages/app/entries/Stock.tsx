import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "components/ui/use-toast";
import { Direction } from "model/direction";
import { Entry, OrderStatus, tradeSchema } from "model/entry";
import { EntryType } from "model/entryType";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { useGetEntry, useSaveEntry } from "service/entryQueries";
import { useGetPortfolio } from "service/portfolioQueries";

import { MessageDisplay } from "components/MessageDisplay";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader } from "components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";

import { useQueryClient } from "@tanstack/react-query";
import { DateTimePicker } from "components/DateTimePicker";
import { DirectionSelect } from "components/DirectionSelect";
import { HelperText } from "components/HelperText";
import { NumberInput } from "components/NumberInput";
import { PageHeader } from "components/PageHeader";
import { Uploader } from "components/Uploader";
import { TableLoading } from "components/table/TableLoading";
import { Dialog, DialogContent, DialogTrigger } from "components/ui/dialog";
import { Input } from "components/ui/input";
import { Separator } from "components/ui/separator";
import { Textarea } from "components/ui/textarea";
import { config } from "lib/config";
import { CheckCheck } from "lucide-react";
import { getSymbol } from "model/currency";
import { Portfolio } from "model/portfolio";
import { NavLink } from "react-router-dom";
import { CloseStockForm } from "./components/CloseStockForm";
import { DeleteEntryButton } from "./components/DeleteEntryButton";
import { EntryImages } from "./components/EntryImages";
import { EntryStatus } from "./components/EntryStatus";

const CloseTrade = ({ entry }: { entry: Entry }) => {
  if (entry.orderStatus === OrderStatus.OPEN) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="link">
            <CheckCheck className="h-4 w-4 mr-1" /> Close trade
          </Button>
        </DialogTrigger>
        <DialogContent>
          <CloseStockForm entry={entry} />
        </DialogContent>
      </Dialog>
    );
  } else {
    return null;
  }
};

const StockForm = ({ portfolio, entry }: { portfolio: Portfolio; entry?: Entry }) => {
  const navigate = useNavigate();
  const mutation = useSaveEntry(portfolio.id!, entry?.id);
  const { toast } = useToast();

  const form = useForm<Entry>({
    resolver: zodResolver(tradeSchema),
    defaultValues: entry,
    values: entry,
  });

  function onSubmit(data: Entry) {
    mutation.mutate(data, {
      onSuccess: (data) => {
        toast({
          title: "Stock saved",
          description: `Stock ${data.symbol} was saved successfully`,
        });
        navigate(`/trading/portfolios/${portfolio.id!}/entries/stock/${data.id}`);
      },
    });
  }

  return (
    <>
      <MessageDisplay message={mutation.error} variant="destructive" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12 md:col-span-6 lg:col-span-4">
              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symbol</FormLabel>
                    <FormControl>
                      <Input placeholder="Stock symbol" {...field}>
                        <HelperText>
                          This is the stock symbol your are buying or selling. (required)
                        </HelperText>
                      </Input>
                    </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-12 md:col-span-6 lg:col-span-4 mt-8">
              <span className="text-muted-foreground ">Strategy is coming soon</span>
            </div>

            <div className="col-span-12 md:col-span-6 lg:col-span-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="mb-2">Date</FormLabel>
                    <DateTimePicker withTime {...field}>
                      <HelperText>
                        This is the date when your stock trade started. (required)
                      </HelperText>
                    </DateTimePicker>
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
                      <NumberInput {...field} currency={getSymbol(portfolio?.currency || "$")}>
                        <HelperText>This is the price of your stock trade. (required)</HelperText>
                      </NumberInput>
                    </FormControl>
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
                      <NumberInput {...field}>
                        <HelperText>
                          How many shares are you buying or selling. (required)
                        </HelperText>
                      </NumberInput>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-12">
              <Separator />
            </div>

            <div className="col-span-12 md:col-span-6 lg:col-span-4">
              <FormField
                control={form.control}
                name="profit"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Take Profit</FormLabel>
                    <FormControl>
                      <NumberInput {...field} currency={getSymbol(portfolio?.currency || "$")}>
                        <HelperText>This is the value of your take profit (optional)</HelperText>
                      </NumberInput>
                    </FormControl>
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
                      <NumberInput {...field} currency={getSymbol(portfolio?.currency || "$")}>
                        <HelperText>This is the value of your stop loss (optional)</HelperText>
                      </NumberInput>
                    </FormControl>
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
                      <NumberInput {...field} currency={getSymbol(portfolio?.currency || "$")}>
                        <HelperText>This is the costs for this stock trade (optional)</HelperText>
                      </NumberInput>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-12">
              <Separator />
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

            <div className="col-span-12">
              <div className="flex flex-wrap sm:justify-end mt-0 mb-0 p-0">
                <Button asChild variant="outline" className="w-full sm:w-[200px]">
                  <NavLink to={`/trading/portfolios/${portfolio.id!}/entries`}>Cancel</NavLink>
                </Button>
                <Button
                  type="submit"
                  className="w-full mt-2 sm:w-[200px] sm:ml-3 sm:mt-0"
                  disabled={mutation.isPending}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export const Stock = () => {
  const { portfolioId, entryId } = useParams();
  const { data: portfolio } = useGetPortfolio(portfolioId);
  const { data: stock, error: queryError } = useGetEntry(portfolioId!, entryId);
  const [values, setValues] = useState<Entry>({
    date: new Date(),
    price: 0,
    entryType: EntryType.STOCK,
    symbol: "",
    direction: Direction.Long,
    size: 0,
    notes: "",
    result: 0,
    portfolio: portfolio!,
  });

  const [deleteError, setDeleteError] = useState<any>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const uploadUrl = `${config.api}/api/v1/portfolios/${portfolioId}/entries/${entryId}/images`;

  useEffect(() => {
    if (stock) {
      setValues(stock);
    }
  }, [stock]);

  if (!portfolio) return <TableLoading />;

  return (
    <div className="flex flex-col">
      <div>
        <MessageDisplay message={queryError} variant="destructive" />
        <MessageDisplay message={deleteError} variant="destructive" />

        <Card>
          <CardHeader>
            <PageHeader>
              <PageHeader.Title>
                <span className="block md:hidden">
                  {stock ? <EntryStatus entry={stock} /> : "Add a new stock"}
                </span>
                <span className="hidden md:block">
                  {stock ? "Edit" : "Add a new"} Stock Trade{" "}
                  {stock && <EntryStatus entry={stock} />}
                </span>
              </PageHeader.Title>
              <PageHeader.Action>
                {stock && (
                  <div className="flex items-center">
                    <CloseTrade entry={stock} />
                    <DeleteEntryButton
                      entry={stock as Entry}
                      onError={(error) => setDeleteError(error)}
                      onSuccess={() => navigate(`/trading/portfolios/${portfolioId}/entries`)}
                      withLabel
                    />
                  </div>
                )}
              </PageHeader.Action>
            </PageHeader>
          </CardHeader>
          <CardContent>
            {portfolio && <StockForm portfolio={portfolio} entry={values} />}
          </CardContent>
        </Card>
      </div>
      {stock && (
        <div className="py-2">
          <div className="px-2">
            <EntryImages entry={stock} />
          </div>
          <div>
            <Uploader
              url={uploadUrl}
              onFileUploaded={() =>
                queryClient.invalidateQueries({
                  queryKey: [`images-${entryId}`],
                })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};
