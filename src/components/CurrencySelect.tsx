import { currencies } from "model/currency";
import { forwardRef } from "react";
import { FormControl } from "./ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

type Props = {
  onChange: (value: string) => void;
  value: string;
  placeholder?: string;
  children?: React.ReactNode;
  [x: string]: any;
};

export const CurrencySelect = forwardRef(function CurrencySelect(props: Props, ref) {
  const { onChange, value: defaultValue, placeholder, children, ...rest } = props;
  const currentPlaceholder = placeholder || "Select Currency";

  return (
    <div className="w-full flex justify-normal items-center space-x-2">
      <div className="relative w-full">
        <div className="relative">
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
          {children}
        </div>
      </div>
    </div>
  );
});
