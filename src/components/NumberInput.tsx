import { useEffect, useRef, useState } from 'react';
import { IMaskInput } from 'react-imask';

type Props = {
  onChange: (value: number | undefined) => void;
  value: number | null | undefined;
  currency?: string;
  placeholder?: string;
  scale?: number;
  [x: string]: any;
};

const defaultOpts: Partial<Props> = {
  placeholder: '0,00',
  scale: 2,
};

export const NumberInput = (props: Props) => {
  const { onChange, value, currency, placeholder, scale, ...rest } = props;
  const ref = useRef(null);
  const inputRef = useRef(null);

  const [first, setFirst] = useState<string | undefined>(
    value ? value.toString() : undefined
  );

  useEffect(() => {
    setFirst(value ? value.toString() : undefined);
  }, [value]);

  return (
    <div className="pt-2">
      <IMaskInput
        mask={currency ? `${currency} num` : 'num'}
        blocks={{
          num: {
            mask: Number,
            radix: ',',
            thousandsSeparator: '.',
            mapToRadix: ['.'],
            scale: scale,
            padFractionalZeros: true,
            normalizeZeros: true,
          },
        }}
        value={first}
        unmask={'typed'}
        ref={ref}
        inputRef={inputRef}
        onAccept={(value) => {
          const num = parseFloat(value);
          if (isNaN(num)) {
            setFirst(undefined);
            onChange(undefined);
          } else {
            setFirst(value);
            onChange(num);
          }
        }}
        onFocus={(e) => e.target.select()}
        placeholder={placeholder || (currency ? `${currency} 0,00` : '0,00')}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        {...rest}
      />
    </div>
  );
};

NumberInput.defaultProps = defaultOpts;
