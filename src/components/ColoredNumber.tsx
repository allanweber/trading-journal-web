import clsx from 'clsx';
import type { PropsWithChildren } from 'react';

type Props = {
  value: number;
  negativeColor?: string;
  positiveColor?: string;
};

export default function ColoredNumber(props: PropsWithChildren<Props>) {
  const { children, value, negativeColor, positiveColor } = props;

  const positive = positiveColor ?? 'text-green-600';
  const negative = negativeColor ?? 'text-red-600';
  const positiveValue = value >= 0;

  return (
    <span className={clsx(positiveValue ? positive : negative, 'text-sm')}>
      {children}
    </span>
  );
}
