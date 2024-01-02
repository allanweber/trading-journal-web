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
import { Deposit, depositSchema } from 'model/entry';
import { EntryType } from 'model/entryType';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSaveEntry } from 'service/entryQueries';

import { DateTimePicker } from 'components/DateTimePicker';
import JournalSelect from 'components/JournalSelect';
import { NumberInput } from 'components/NumberInput';
import { TextArea } from 'components/TextArea';
import { getSymbol } from 'model/currency';
import { Journal } from 'model/journal';
import { NavLink } from 'react-router-dom';

export const DepositForm = ({ deposit }: { deposit?: Deposit }) => {
  const startValues: Deposit = {
    description: '',
    journalId: '',
    date: new Date(),
    price: 0,
    entryType: EntryType.Deposit,
  };

  const [values, setValues] = useState<Deposit>(deposit || startValues);
  const [journal, setJournal] = useState<Journal | undefined>(undefined);
  const navigate = useNavigate();
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
          title: 'Deposit saved',
          description: `Your deposit was saved successfully`,
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
                  disabled={deposit}
                  onJournalChange={(journal) => setJournal(journal)}
                />
                <FormDescription>
                  This is the journal where your deposit takes place. (required)
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
                <FormLabel>Deposit Date</FormLabel>
                <DateTimePicker
                  withTime
                  setDate={field.onChange}
                  date={field.value}
                  disabled={deposit}
                />
                <FormDescription>
                  This is the date when you did or will do your deposit, this is
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
                <FormLabel>Deposit value</FormLabel>
                <NumberInput
                  disabled={deposit}
                  {...field}
                  currency={getSymbol(journal?.currency || '$')}
                />

                <FormDescription>
                  This is the value o5 your deposit, this is used to calculate
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
                  This is just a brief description of your deposit. (optional)
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
};
