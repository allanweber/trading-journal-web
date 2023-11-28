import {
  currencyFormatter,
  numberFormatter,
  percentFormatter,
} from 'lib/number';

type Props = {
  value: number | undefined;
  currency?: string;
  isPercentage?: boolean;
};

export default function NumberDisplay(props: Props) {
  const { value, currency, isPercentage } = props;

  if (isPercentage) {
    return <span>{percentFormatter(value)}</span>;
  }

  if (currency) {
    return <span>{currencyFormatter(value, currency)}</span>;
  }

  return <span>{numberFormatter(value)}</span>;
}
