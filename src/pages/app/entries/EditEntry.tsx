import { MessageDisplay } from "components/MessageDisplay";
import { TableLoading } from "components/table/TableLoading";
import { Entry, dividendSchema, tradeSchema } from "model/entry";
import { EntryType } from "model/entryType";
import { useParams } from "react-router-dom";
import { useGetEntry } from "service/entryQueries";
import DividendForm from "./components/DividendForm";
import { TradeForm } from "./components/TradeForm";

const EntryForm = ({ entry }: { entry: Entry }) => {
  switch (entry.entryType) {
    case EntryType.STOCK:
      return <TradeForm trade={tradeSchema.parse(entry)} />;
    case EntryType.DIVIDEND:
      return <DividendForm dividend={dividendSchema.parse(entry)} />;
    default:
      throw new Error(`Invalid entry type: ${entry.entryType}`);
  }
};

export const EditEntry = () => {
  const { id } = useParams();

  const { data, isLoading, isSuccess, error: queryError } = useGetEntry(id!);

  if (isLoading) {
    return <TableLoading />;
  }

  if (queryError) {
    return <MessageDisplay message={queryError} variant="destructive" />;
  }

  if (isSuccess && !data) {
    return <MessageDisplay message="Entry not found" variant="destructive" />;
  }

  return <EntryForm entry={data!} />;
};
