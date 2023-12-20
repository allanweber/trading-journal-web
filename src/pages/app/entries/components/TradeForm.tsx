import { zodResolver } from '@hookform/resolvers/zod';
import { MessageDisplay } from 'components/MessageDisplay';
import { Button } from 'components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'components/ui/form';
import { useToast } from 'components/ui/use-toast';
import { Trade, tradeSchema } from 'model/entry';
import { EntryType } from 'model/entryType';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSaveEntry } from 'service/entryQueries';

import { DateTimePicker } from 'components/DateTimePicker';
import { DirectionSelect } from 'components/DirectionSelect';
import JournalSelect from 'components/JournalSelect';
import { NumberInput } from 'components/NumberInput';
import { TextArea } from 'components/TextArea';
import { Input } from 'components/ui/input';
import { Separator } from 'components/ui/separator';
import { Direction } from 'model/direction';
import { NavLink } from 'react-router-dom';

export const TradeForm = ({ trade }: { trade?: Trade }) => {
  const startValues: Trade = {
    journalId: '',
    date: new Date(),
    price: 0,
    entryType: EntryType.Trade,
    symbol: '',
    direction: Direction.Long,
    size: 0,
    description: '',
  };

  const [values, setValues] = useState<Trade>(trade || startValues);
  const navigate = useNavigate();
  const { toast } = useToast();

  const mutation = useSaveEntry();

  useEffect(() => {
    if (trade) {
      setValues(trade);
    }
  }, [trade]);

  const form = useForm<Trade>({
    resolver: zodResolver(tradeSchema),
    defaultValues: values,
    values,
  });

  function onSubmit(data: Trade) {
    mutation.mutate(data, {
      onSuccess: (data) => {
        toast({
          title: 'Trade saved',
          description: `Your trade was saved successfully`,
        });
        navigate('/trading/entries');
      },
    });
  }

  return (
    <>
      <MessageDisplay message={mutation.error} variant="destructive" />
      <Form {...form}>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <FormField
                  control={form.control}
                  name="journalId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Journal Name</FormLabel>
                      <FormControl>
                        <JournalSelect
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={trade}
                        />
                      </FormControl>
                      <FormDescription>
                        This is the journal where your trade takes place.
                        (required)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <FormField
                  control={form.control}
                  name="symbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Symbol</FormLabel>
                      <FormControl>
                        <Input placeholder="Trade symbol" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the trade symbol your are buying or selling.
                        (required)
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
                        <DirectionSelect
                          onValueChange={field.onChange}
                          value={field.value}
                        />
                      </FormControl>
                      <FormDescription>
                        This is the direction of your trade. (required)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="mb-2">Date</FormLabel>

                      <DateTimePicker
                        withTime
                        setDate={field.onChange}
                        date={field.value}
                        disabled={trade}
                      />

                      <FormDescription>
                        This is the date when your trade started. (required)
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
                        <NumberInput {...field} />
                      </FormControl>

                      <FormDescription>
                        This is the value of your trade. (required)
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
                        <NumberInput {...field} />
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
                        <NumberInput {...field} />
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
                        <NumberInput {...field} />
                      </FormControl>

                      <FormDescription>
                        This is the value of your stop loss (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                {/* Add strategy here */}
              </div>

              <div className="col-span-12">
                <Separator className="mb-3" />
                <h3 className="-ml-1">Close Trade</h3>
              </div>

              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <FormField
                  control={form.control}
                  name="exitDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="mb-2">Exit Date</FormLabel>

                      <DateTimePicker
                        withTime
                        setDate={field.onChange}
                        date={field.value ?? undefined}
                      />

                      <FormDescription>
                        This is the date when you closed your trade (optional)
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
                        <NumberInput {...field} />
                      </FormControl>

                      <FormDescription>
                        This is the price when you closed your trade (optional)
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
                        <NumberInput {...field} />
                      </FormControl>

                      <FormDescription>
                        Possible costs for this trade. there (optional)
                      </FormDescription>
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <TextArea placeholder="Description" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is just a brief description of your trade.
                        (optional)
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
    </>
  );
};
