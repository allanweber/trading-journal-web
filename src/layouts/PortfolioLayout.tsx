import { useToast } from "components/ui/use-toast";
import { PortfolioSummary } from "pages/app/portfolios/components/PortfolioSummary";
import { useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useGetPortfolio } from "service/portfolioQueries";

export const PortfolioLayout = () => {
  const { portfolioId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data, error, isFetched } = useGetPortfolio(portfolioId!);

  useEffect(() => {
    if (isFetched && (error || !data)) {
      toast({
        title: "Invalid portfolio",
        variant: "destructive",
      });
      navigate("/trading/portfolios");
    }
  }, [data, error, isFetched, navigate, toast]);

  return (
    <>
      {data && <PortfolioSummary portfolio={data} />}
      <div className="p-4">
        <Outlet />
      </div>
    </>
  );
};
