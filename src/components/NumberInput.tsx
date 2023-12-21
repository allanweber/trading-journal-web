import { LegacyRef, useEffect, useState } from 'react';
import { useIMask } from 'react-imask';

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

export const NumberInput = ({
  onChange,
  value,
  currency,
  placeholder,
  scale,
  ...rest
}: Props) => {
  const [opts, setOps] = useState({
    mask: currency ? `${currency} num` : 'num',
    lazy: true,
    blocks: {
      num: {
        mask: Number,
        radix: ',',
        thousandsSeparator: '.',
        mapToRadix: ['.'],
        scale: scale,
        padFractionalZeros: true,
        normalizeZeros: true,
      },
    },
  });

  useEffect(() => {
    setOps({
      mask: currency ? `${currency} num` : 'num',
      lazy: true,
      blocks: {
        num: {
          mask: Number,
          radix: ',',
          thousandsSeparator: '.',
          mapToRadix: ['.'],
          scale: scale,
          padFractionalZeros: true,
          normalizeZeros: true,
        },
      },
    });
  }, [currency, scale]);

  const { ref } = useIMask(opts, {
    onAccept: (val) => {
      const num = parseFloat(
        val
          .replace(currency || '$', '')
          .trim()
          .replace('.', '')
          .replace(',', '.')
      );
      onChange(num);
    },
  });

  return (
    <div className="pt-2">
      <input
        defaultValue={value ? value.toString().replace('.', ',') : ''}
        placeholder={placeholder || (currency ? `${currency} 0,00` : '0,00')}
        type={'text'}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        ref={ref as LegacyRef<HTMLInputElement>}
        onFocus={(e) => e.target.select()}
        {...rest}
      />
    </div>
  );
};

NumberInput.defaultProps = defaultOpts;
