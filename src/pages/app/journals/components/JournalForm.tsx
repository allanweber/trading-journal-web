import { zodResolver } from '@hookform/resolvers/zod';
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
import { Input } from 'components/ui/input';
import { useToast } from 'components/ui/use-toast';
import { useForm } from 'react-hook-form';

import CurrencySelect from 'components/CurrencySelect';
import { DateTimePicker } from 'components/DateTimePicker';
import { MessageDisplay } from 'components/MessageDisplay';
import { NumberInput } from 'components/NumberInput';
import { getSymbol } from 'model/currency';
import { Journal, journalSchema } from 'model/journal';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSaveJournal } from 'service/journalQueries';

export const JournalForm = ({ journal }: { journal?: Journal }) => {
  const startValues = {
    name: '',
    description: '',
    startDate: new Date(),
    startBalance: 0,
    currency: 'USD',
  };

  const [values, setValues] = useState<Journal>(journal || startValues);
  const navigate = useNavigate();
  const { toast } = useToast();

  const mutation = useSaveJournal();
  useEffect(() => {
    if (journal) {
      setValues(journal);
    }
  }, [journal]);

  const form = useForm<Journal>({
    resolver: zodResolver(journalSchema),
    defaultValues: values,
    values,
  });

  function onSubmit(data: Journal) {
    mutation.mutate(data, {
      onSuccess: (data) => {
        toast({
          title: 'Journal saved',
          description: `Your journal ${data.name} was saved successfully`,
        });
        navigate('/trading/journals');
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Journal Name</FormLabel>
                <FormControl>
                  <Input placeholder="Journal Name" {...field} />
                </FormControl>
                <FormDescription>
                  This is the name of your journal that will be displayed
                  everywhere. (required)
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
                  <Input placeholder="Journal Description" {...field} />
                </FormControl>
                <FormDescription>
                  This is just a brief description of your journal. (optional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <DateTimePicker
                  setDate={field.onChange}
                  date={field.value}
                  disabled={journal}
                />
                <FormDescription>
                  This is the date when you started your journal used to
                  calculate your balance, and can never be changed. (required)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startBalance"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Balance</FormLabel>
                <NumberInput
                  {...field}
                  disabled={journal}
                  currency={getSymbol(form.getValues('currency') || '$')}
                />
                <FormDescription>
                  This is the balance of your account at the start of your
                  journal, and can never be changed. (required)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Journal Currency</FormLabel>
                <CurrencySelect
                  onValueChange={field.onChange}
                  value={field.value}
                />
                <FormDescription>
                  This is the currency of your journal that will be shown for
                  all your trades. (required)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-wrap sm:justify-end">
            <Button asChild variant="outline" className="w-full sm:w-[200px]">
              <NavLink to="/trading/journals">Cancel</NavLink>
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
