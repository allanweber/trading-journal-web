import { LegacyRef, forwardRef, useEffect, useState } from 'react';
import { useIMask } from 'react-imask';

type Props = {
  onChange: (value: number | undefined) => void;
  value: number;
  currency?: string;
  placeholder?: string;
  scale?: number;
  [x: string]: any;
};

const defaultOpts: Partial<Props> = {
  placeholder: '0,00',
  scale: 2,
};

export const NumberInput = forwardRef(function NumberInput(
  props: Props,
  compRef
) {
  const { onChange, value, currency, placeholder, scale, ...rest } = props;

  const [opts] = useState({
    mask: currency ? `${currency} num` : 'num',
    lazy: false,
    blocks: {
      num: {
        mask: Number,
        radix: ',',
        thousandsSeparator: '.',
        mapToRadix: ['.'],
        scale: scale,
        padFractionalZeros: true,
      },
    },
  });

  const { ref, unmaskedValue, setUnmaskedValue } = useIMask(opts);

  useEffect(() => {
    setUnmaskedValue(value ? value.toString() : '');
  }, [setUnmaskedValue, value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsedValue = parseFloat(unmaskedValue);
    if (isNaN(parsedValue)) {
      onChange(undefined);
    } else {
      onChange(parsedValue);
    }
  };

  return (
    <div className="pt-2">
      <input
        defaultValue={value}
        placeholder={placeholder || '0'}
        type={'text'}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        ref={ref as LegacyRef<HTMLInputElement>}
        onChange={handleChange}
        onFocus={(e) => e.target.select()}
        {...rest}
      />
    </div>
  );
});

NumberInput.defaultProps = defaultOpts;
