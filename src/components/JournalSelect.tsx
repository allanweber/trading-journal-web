import { Journal } from 'model/journal';
import { forwardRef } from 'react';
import { useAllJournals } from 'service/journalQueries';
import { FormControl } from './ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

type Props = {
  onChange: (value: string) => void;
  value: string;
  onJournalChange?: (journal: Journal) => void;
  placeholder?: string;
  [x: string]: any;
};

export const JournalSelect = forwardRef(function JournalSelect(
  props: Props,
  ref
) {
  const {
    onChange,
    value: defaultValue,
    onJournalChange,
    placeholder,
    ...rest
  } = props;
  const currentPlaceholder = placeholder || 'Select a Journal';

  const { data: journals, isLoading, isSuccess } = useAllJournals();

  const select = (value: string) => {
    onChange(value);
    if (onJournalChange) {
      const journal = journals?.find((journal) => journal.id === value);
      if (journal) {
        onJournalChange(journal);
      }
    }
  };

  return (
    <Select onValueChange={select} value={defaultValue} {...rest}>
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder={currentPlaceholder} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {isLoading ? (
          <SelectItem value="loading">Loading...</SelectItem>
        ) : isSuccess && journals ? (
          journals.map((journal) => (
            <SelectItem value={journal.id!} key={journal.id!}>
              {journal.name} - {journal.description} ({journal.currency})
            </SelectItem>
          ))
        ) : (
          <SelectItem value="loading">Error</SelectItem>
        )}
      </SelectContent>
    </Select>
  );
});
