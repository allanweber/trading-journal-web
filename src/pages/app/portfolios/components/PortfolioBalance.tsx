import ColoredNumber from "components/ColoredNumber";
import NumberDisplay from "components/NumberDisplay";
import { TrendingDown, TrendingUp } from "lucide-react";

type Props = {
  balance: number;
  startBalance: number;
  currency: string;
  className?: string;
};

export const PortfolioBalance = (props: Props) => {
  const { balance, startBalance, currency, className } = props;
  return (
    <>
      <div className="flex items-center">
        {balance > startBalance ? (
          <TrendingUp className="h-5 w-5 text-green-600 mr-2" aria-hidden="true" />
        ) : balance < startBalance ? (
          <TrendingDown className="h-5 w-5 text-red-600 mr-2" aria-hidden="true" />
        ) : null}

        <div aria-label="portfolio balance">
          <ColoredNumber value={balance} className={className}>
            <NumberDisplay currency={currency}>{balance}</NumberDisplay>
          </ColoredNumber>
        </div>
      </div>
    </>
  );
};
