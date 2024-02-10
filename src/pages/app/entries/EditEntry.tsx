import { useQueryClient } from "@tanstack/react-query";
import { MessageDisplay } from "components/MessageDisplay";
import { Uploader } from "components/Uploader";
import { TableLoading } from "components/table/TableLoading";
import { config } from "lib/config";
import { OrderStatus } from "model/entry";
import { useParams } from "react-router-dom";
import { useGetEntry } from "service/entryQueries";
import { ClosedEntry } from "./components/ClosedEntry";
import { EntryImages } from "./components/EntryImages";
import { StockForm } from "./components/StockForm";

export const EditEntry = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: entry, isLoading, isSuccess, error: queryError } = useGetEntry(id!);

  if (isLoading) {
    return <TableLoading />;
  }

  if (queryError) {
    return <MessageDisplay message={queryError} variant="destructive" />;
  }

  if (isSuccess && !entry) {
    return <MessageDisplay message="Entry not found" variant="destructive" />;
  }

  if (entry?.orderStatus === OrderStatus.CLOSED) {
    return <ClosedEntry entry={entry!} />;
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 md:col-span-7 lg:col-span-6">
        <StockForm stock={entry!} />
      </div>
      <div className="col-span-12 md:col-span-5 lg:col-span-6">
        <div>
          <EntryImages entryId={entry?.id!} />
        </div>
        <div>
          <Uploader
            url={`${config.api}/api/v1/portfolios/${entry?.portfolioId}/entries/${entry?.id}/images`}
            onFileUploaded={() =>
              queryClient.invalidateQueries({
                queryKey: [`images-${entry?.id}`],
              })
            }
          />
        </div>
      </div>
    </div>
  );
};
