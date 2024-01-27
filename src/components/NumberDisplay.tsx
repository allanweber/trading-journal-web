import { currencyFormatter, numberFormatter, percentFormatter } from "lib/number";

type Props = {
  value: number | undefined;
  currency?: string;
  isPercentage?: boolean;
  withSign?: boolean;
};

export default function NumberDisplay(props: Props) {
  const { value, currency, isPercentage, withSign } = props;
  let sign = undefined;
  let formattedValue = undefined;

  if (withSign) {
    if (value && value > 0) {
      sign = "+";
    } else if (value && value < 0) {
      sign = "-";
    }
  }

  if (value) {
    if (isPercentage) {
      formattedValue = percentFormatter(value);
    } else if (currency) {
      formattedValue = currencyFormatter(value, currency);
    } else {
      formattedValue = numberFormatter(value);
    }

    if (withSign) {
      formattedValue = `${sign} ${formattedValue}`;
    }
  } else {
    formattedValue = "N/A";
  }

  return <span>{formattedValue}</span>;
}
