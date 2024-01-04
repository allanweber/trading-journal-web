import { currencies } from 'model/currency';
import { forwardRef } from 'react';
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
  placeholder?: string;
  [x: string]: any;
};

export const CurrencySelect = forwardRef(function CurrencySelect(
  props: Props,
  ref
) {
  const { onChange, value: defaultValue, placeholder, ...rest } = props;
  const currentPlaceholder = placeholder || 'Select Currency';

  return (
    <Select onValueChange={onChange} value={defaultValue} {...rest}>
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
});
