import { MessageDisplay } from "components/MessageDisplay";
import { TableLoading } from "components/table/TableLoading";
import { Entry } from "model/entry";
import { EntryType } from "model/entryType";
import { useParams } from "react-router-dom";
import { useGetEntry } from "service/entryQueries";
import DividendForm from "./components/DividendForm";
import { StockForm } from "./components/StockForm";

const EntryForm = ({ entry }: { entry: Entry }) => {
  switch (entry.entryType) {
    case EntryType.STOCK:
      return <StockForm stock={entry} />;
    case EntryType.DIVIDEND:
      return <DividendForm dividend={entry} />;
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
