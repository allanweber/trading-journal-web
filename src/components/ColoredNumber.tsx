import clsx from 'clsx';
import type { PropsWithChildren } from 'react';

type Props = {
  value: number;
};

export default function ColoredNumber(props: PropsWithChildren<Props>) {
  const { children, value } = props;

  const positive = 'text-green-600';
  const negative = 'text-red-600';
  const positiveValue = value >= 0;

  return (
    <span className={clsx(positiveValue ? positive : negative, 'text-sm')}>
      {children}
    </span>
  );
}
