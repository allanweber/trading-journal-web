import { EntryType } from "model/entryType";
import { useNavigate, useParams } from "react-router-dom";
import DividendForm from "./components/DividendForm";
import { StockForm } from "./components/StockForm";

const EntryForm = ({ entryType }: { entryType: EntryType }) => {
  switch (entryType) {
    case EntryType.STOCK:
      return (
        <div className="mx-auto max-w-3xl">
          <StockForm />
        </div>
      );
    case EntryType.DIVIDEND:
      return (
        <div className="mx-auto max-w-lg">
          <DividendForm />
        </div>
      );
    default:
      throw new Error(`Invalid entry type: ${entryType}`);
  }
};

export const NewEntry = () => {
  const { tradeType } = useParams();
  const navigate = useNavigate();
  if (!tradeType) {
    navigate("/trading/entries");
  }

  const type = tradeType as EntryType;

  return <EntryForm entryType={type} />;
};
