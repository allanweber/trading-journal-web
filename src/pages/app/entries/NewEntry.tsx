import { EntryType } from "model/entryType";
import { useNavigate, useParams } from "react-router-dom";
import DividendForm from "./components/DividendForm";
import { TradeForm } from "./components/TradeForm";

const EntryForm = ({ entryType }: { entryType: EntryType }) => {
  switch (entryType) {
    case EntryType.STOCK:
      return <TradeForm />;
    case EntryType.DIVIDEND:
      return <DividendForm />;
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
