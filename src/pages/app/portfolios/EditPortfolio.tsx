import { MessageDisplay } from "components/MessageDisplay";
import { TableLoading } from "components/table/TableLoading";
import { cn } from "lib/utils";
import { PortfolioForm } from "pages/app/portfolios/components/PortfolioForm";
import { useParams } from "react-router-dom";
import { useGetPortfolio } from "service/portfolioQueries";
import { PortfolioEntries } from "./components/PortfolioEntries";

export const EditPortfolio = () => {
  const { id } = useParams();
  const { data: portfolio, isLoading, error: queryError } = useGetPortfolio(id!);

  if (isLoading) {
    return <TableLoading />;
  }

  if (queryError) {
    return <MessageDisplay message={queryError} variant="destructive" />;
  }

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className={cn("col-span-12 md:col-span-6")}>
          <PortfolioForm portfolio={portfolio} />
        </div>

        <div className="col-span-12 md:col-span-6">
          <PortfolioEntries portfolio={portfolio!} />
        </div>
      </div>
    </>
  );
};
