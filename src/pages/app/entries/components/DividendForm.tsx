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
import { Dividend, dividendSchema } from 'model/entry';
import { EntryType } from 'model/entryType';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSaveDividend } from 'service/entryQueries';

import { DateTimePicker } from 'components/DateTimePicker';
import JournalSelect from 'components/JournalSelect';
import { NumberInput } from 'components/NumberInput';
import { TextArea } from 'components/TextArea';
import { Input } from 'components/ui/input';
import { NavLink } from 'react-router-dom';

export default function DividendForm({ dividend }: { dividend?: Dividend }) {
  const startValues: Dividend = {
    symbol: '',
    description: '',
    journalId: '',
    date: new Date(),
    price: 0,
    entryType: EntryType.Dividend,
  };

  const [values, setValues] = useState<Dividend>(dividend || startValues);
  const navigate = useNavigate();
  const { toast } = useToast();

  const mutation = useSaveDividend();

  useEffect(() => {
    if (dividend) {
      setValues(dividend);
    }
  }, [dividend]);

  const form = useForm<Dividend>({
    resolver: zodResolver(dividendSchema),
    defaultValues: values,
    values,
  });

  function onSubmit(data: Dividend) {
    mutation.mutate(data, {
      onSuccess: (data) => {
        toast({
          title: 'Dividend saved',
          description: `Your dividend was saved successfully`,
        });
        navigate('/trading/entries');
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
            name="journalId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Journal Name</FormLabel>
                <JournalSelect
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={dividend}
                />
                <FormDescription>
                  This is the journal where your dividend takes place.
                  (required)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="symbol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dividend Symbol</FormLabel>
                <FormControl>
                  <Input placeholder="Dividend Symbol" {...field} />
                </FormControl>
                <FormDescription>
                  This is the trade symbol from where you received your
                  dividend. (required)
                </FormDescription>
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
                <DateTimePicker
                  withTime
                  setDate={field.onChange}
                  date={field.value}
                  disabled={dividend}
                />
                <FormDescription>
                  This is the date when you received do your dividend, this is
                  used to calculate your balance, and can never be changed.
                  (required)
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
                <FormLabel>Dividend value</FormLabel>
                <NumberInput {...field} disabled={dividend} />
                <FormDescription>
                  This is the value of your dividend, this is used to calculate
                  your balance, and can never be changed. (required)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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
    </>
  );
}
