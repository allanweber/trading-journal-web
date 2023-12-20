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
import { Taxes, taxesSchema } from 'model/entry';
import { EntryType } from 'model/entryType';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSaveEntry } from 'service/entryQueries';

import { DateTimePicker } from 'components/DateTimePicker';
import JournalSelect from 'components/JournalSelect';
import { NumberInput } from 'components/NumberInput';
import { TextArea } from 'components/TextArea';
import { NavLink } from 'react-router-dom';

export const TaxesForm = ({ taxes }: { taxes?: Taxes }) => {
  const startValues: Taxes = {
    description: '',
    journalId: '',
    date: new Date(),
    price: 0,
    entryType: EntryType.Taxes,
  };

  const [values, setValues] = useState<Taxes>(taxes || startValues);
  const navigate = useNavigate();
  const { toast } = useToast();

  const mutation = useSaveEntry();

  useEffect(() => {
    if (taxes) {
      setValues(taxes);
    }
  }, [taxes]);

  const form = useForm<Taxes>({
    resolver: zodResolver(taxesSchema),
    defaultValues: values,
    values,
  });

  function onSubmit(data: Taxes) {
    mutation.mutate(data, {
      onSuccess: (data) => {
        toast({
          title: 'Taxes saved',
          description: `Your taxes were saved successfully`,
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
                  disabled={taxes}
                />
                <FormDescription>
                  This is the journal where your taxes takes place. (required)
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
                <FormLabel>Taxes Date</FormLabel>
                <DateTimePicker
                  withTime
                  setDate={field.onChange}
                  date={field.value}
                  disabled={taxes}
                />
                <FormDescription>
                  This is the date when you declared your taxes, this is used to
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
                <FormLabel>Taxes value</FormLabel>
                <NumberInput {...field} disabled={taxes} />
                <FormDescription>
                  This is the value of your taxes, this is used to calculate
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
                  This is just a brief description of your taxes. (optional)
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
