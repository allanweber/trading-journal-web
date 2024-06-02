import ColoredNumber from "components/ColoredNumber";
import { MessageDisplay } from "components/MessageDisplay";
import NumberDisplay from "components/NumberDisplay";
import { PageHeader } from "components/PageHeader";
import { TableLoading } from "components/table/TableLoading";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "components/ui/card";
import { percentFormatter } from "lib/number";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Portfolio } from "model/portfolio";
import { useNavigate } from "react-router-dom";
import { useAllPortfolios } from "service/portfolioQueries";
import { NoPortfoliosCard } from "./portfolios/components/NoPortfoliosCard";

const Footer = ({ portfolio }: { portfolio: Portfolio }) => {
  const balancePercentage = (portfolio.currentBalance! - portfolio.startBalance) / 100;

  return (
    <div className="text-xs text-muted-foreground flex flex-row gap-1">
      <span>
        {balancePercentage > 0 ? "+" : ""}
        {percentFormatter(balancePercentage)}
      </span>
      <span>from the beginning</span>
    </div>
  );
};

export const Trading = () => {
  const { data: portfolios, isLoading, isSuccess, error: queryError } = useAllPortfolios();
  const navigate = useNavigate();
  return (
    <div className="p-4 space-y-2">
      <PageHeader>
        <PageHeader.Title>Portfolios</PageHeader.Title>
      </PageHeader>
      <MessageDisplay message={queryError} variant="destructive" />

      {isLoading && isSuccess ? (
        <TableLoading />
      ) : (
        isSuccess &&
        portfolios &&
        (portfolios.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3 md:gap-8 xl:grid-cols-4 ">
            {portfolios?.map((portfolio, index) => (
              <span key={index}>
                <Card
                  className="hover:scale-105 hover:cursor-pointer"
                  onClick={() => navigate(`/trading/portfolios/${portfolio.id}/entries`)}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{portfolio.name}</CardTitle>
                    {portfolio.currentBalance! > portfolio.startBalance ? (
                      <TrendingUp className="h-5 w-5 text-green-600 mr-2" aria-hidden="true" />
                    ) : portfolio.currentBalance! < portfolio.startBalance ? (
                      <TrendingDown className="h-5 w-5 text-red-600 mr-2" aria-hidden="true" />
                    ) : null}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold">
                      <ColoredNumber value={portfolio.currentBalance!}>
                        <NumberDisplay currency={portfolio.currency}>
                          {portfolio.currentBalance}
                        </NumberDisplay>
                      </ColoredNumber>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Footer portfolio={portfolio} />
                  </CardFooter>
                </Card>
              </span>
            ))}
          </div>
        ) : (
          <NoPortfoliosCard />
        ))
      )}
    </div>
  );
};
