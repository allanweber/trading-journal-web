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
import { Withdrawal, withdrawalSchema } from 'model/entry';
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

export const WithdrawalForm = ({ withdrawal }: { withdrawal?: Withdrawal }) => {
  const startValues: Withdrawal = {
    description: '',
    journalId: '',
    date: new Date(),
    price: 0,
    entryType: EntryType.Withdrawal,
  };

  const [values, setValues] = useState<Withdrawal>(withdrawal || startValues);
  const [journal, setJournal] = useState<Journal | undefined>(undefined);
  const navigate = useNavigate();
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
          title: 'Withdrawal saved',
          description: `Your withdrawal was saved successfully`,
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
                  disabled={withdrawal}
                  onJournalChange={(journal) => setJournal(journal)}
                />
                <FormDescription>
                  This is the journal where your withdrawal takes place.
                  (required)
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
                <FormLabel>Withdrawal Date</FormLabel>
                <DateTimePicker withTime {...field} disabled={withdrawal} />
                <FormDescription>
                  This is the date when you did or will do your withdrawal, this
                  is used to calculate your balance, and can never be changed.
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
                <FormLabel>Withdrawal value</FormLabel>
                <NumberInput
                  disabled={withdrawal}
                  {...field}
                  currency={getSymbol(journal?.currency || '$')}
                />
                <FormDescription>
                  This is the value of your withdrawal, this is used to
                  calculate your balance, and can never be changed. (required)
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
                  This is just a brief description of your withdrawal.
                  (optional)
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
