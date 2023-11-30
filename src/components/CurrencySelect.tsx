import { currencies } from 'model/currency';
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

export default function CurrencySelect(props: Props) {
  const { onValueChange, value: defaultValue, placeholder, ...rest } = props;
  const currentPlaceholder = placeholder || 'Select Currency';

  return (
    <Select onValueChange={onValueChange} value={defaultValue} {...rest}>
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder={currentPlaceholder} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {currencies.map((currency) => (
          <SelectItem value={currency.value} key={currency.value}>
            {currency.symbol} - {currency.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
