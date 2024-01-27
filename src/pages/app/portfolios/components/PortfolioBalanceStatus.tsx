import { usePortfolioContext } from "contexts/PortfolioContext";
import { useGetPortfolioBalance } from "service/portfolioQueries";
import { PortfolioBalance } from "./PortfolioBalance";

type Props = {
  className?: string;
};

export default function PortfolioBalanceStatus({ className }: Props) {
  const { portfolio } = usePortfolioContext();
  const { data, isSuccess } = useGetPortfolioBalance(portfolio?.id!);

  return (
    <>
      {isSuccess && (
        <PortfolioBalance
          balance={data.balance!}
          startBalance={data.startBalance}
          currency={portfolio?.currency!}
          className={className}
        />
      )}
    </>
  );
}
