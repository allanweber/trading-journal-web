import { Portfolio } from "model/portfolio";
import { AddPortfolioBalance } from "pages/app/portfolios/components/AddPortfolioBalance";
import { PortfolioBalance } from "pages/app/portfolios/components/PortfolioBalance";
import { NavLink } from "react-router-dom";

export const PortfolioSummary = ({ portfolio }: { portfolio: Portfolio }) => {
  return (
    <div className="flex h-12 items-center border-b px-4 lg:h-[60px]">
      <div className="w-full flex-1"></div>
      <div>
        <div className="flex items-center gap-2">
          <NavLink to={`/trading/portfolios/${portfolio?.id}/entries`}>
            <PortfolioBalance
              balance={portfolio.currentBalance!}
              startBalance={portfolio.startBalance}
              currency={portfolio?.currency!}
              className="text-xl"
            />
          </NavLink>

          <AddPortfolioBalance portfolio={portfolio} showEditIcon />
        </div>
      </div>
    </div>
  );
};
