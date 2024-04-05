import { EntryType } from "model/entryType";
import { useNavigate, useParams } from "react-router-dom";
import { useGetPortfolio } from "service/portfolioQueries";
import DividendForm from "./components/DividendForm";
import { StockForm } from "./components/StockForm";

export const NewEntry = () => {
  const { portfolioId, tradeType } = useParams();
  const { data: portfolio } = useGetPortfolio(portfolioId!);
  const navigate = useNavigate();
  if (!tradeType) {
    navigate("/trading/entries");
  }

  const type = tradeType as EntryType;

  switch (type) {
    case EntryType.STOCK:
      return (
        <div className="max-w-3xl">
          <StockForm portfolio={portfolio!} />
        </div>
      );
    case EntryType.DIVIDEND:
      return (
        <div className="max-w-lg">
          <DividendForm portfolio={portfolio!} />
        </div>
      );
    default:
      throw new Error(`Invalid entry type: ${type}`);
  }
};
