import { Settings } from "lucide-react";
import { Portfolio } from "model/portfolio";

import { Link } from "components/Link";
import { NavLink } from "react-router-dom";
import { AddPortfolioBalance } from "./AddPortfolioBalance";
import { PortfolioBalance } from "./PortfolioBalance";

export const PortfolioSummary = ({ portfolio }: { portfolio: Portfolio }) => {
  return (
    <div className="flex h-12 items-center border-b px-4 lg:h-[60px]">
      <div className="w-full flex-1 flex items-center space-x-2">
        <Link to={`/trading/portfolios/${portfolio.id}/edit`} className="flex items-center gap-1">
          <span className="text-xl">{portfolio.name}</span>

          <Settings size={20} className="text-secondary-foreground hover:bg-secondary/80" />
        </Link>
      </div>
      <div>
        <div className="flex items-center gap-2">
          <NavLink to={`/trading/portfolios/${portfolio?.id}/edit`}>
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
