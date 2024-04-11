import { Card, CardContent } from "components/ui/card";
import { useAllPortfolios } from "service/portfolioQueries";
import { NoPortfoliosCard } from "./portfolios/components/NoPortfoliosCard";

export const Trading = () => {
  const { data, isSuccess } = useAllPortfolios();
  return (
    <div className="p-4">
      <Card>
        <CardContent className="py-2">
          {isSuccess && data.length > 0 ? (
            <div>Trading Journal Main Page</div>
          ) : (
            <NoPortfoliosCard />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
