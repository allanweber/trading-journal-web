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
  onValueChange: (value: string) => void;
  value: string;
  placeholder?: string;
  [x: string]: any;
};

export default function JournalSelect(props: Props) {
  const { onValueChange, value: defaultValue, placeholder, ...rest } = props;
  const currentPlaceholder = placeholder || 'Select a Journal';

  const { data: journals, isLoading, isSuccess } = useAllJournals();

  return (
    <Select onValueChange={onValueChange} value={defaultValue} {...rest}>
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
            <SelectItem value={journal._id!} key={journal._id!}>
              {journal.name} - {journal.description}: {journal.currency}
            </SelectItem>
          ))
        ) : (
          <SelectItem value="loading">Error</SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}
