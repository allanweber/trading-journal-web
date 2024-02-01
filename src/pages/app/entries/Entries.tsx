import ColoredNumber from "components/ColoredNumber";
import DateDisplay from "components/DateDisplay";
import { DateDistance } from "components/DateDistance";
import { DirectionDisplay } from "components/DirectionDisplay";
import { MessageDisplay } from "components/MessageDisplay";
import NumberDisplay from "components/NumberDisplay";
import { PageHeader } from "components/PageHeader";
import { TableLoading } from "components/table/TableLoading";
import { TablePagination } from "components/table/TablePagination";
import { Button } from "components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/ui/table";
import { useToast } from "components/ui/use-toast";
import { CandlestickChart } from "lucide-react";
import { Entry } from "model/entry";
import { EntryType } from "model/entryType";
import { Size } from "model/size";
import { AddEntryButton } from "pages/app/entries/components/AddEntryButton";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetEntries } from "service/entryQueries";
import { DeleteEntryButton } from "./components/DeleteEntryButton";
import { EntrySearch } from "./components/EntrySearch";
import { EntryStatus } from "./components/EntryStatus";

const Result = ({ entry, className }: { entry: Entry; className?: string }) => {
  if (!entry.result || entry.result === 0)
    return <NumberDisplay value={entry.result} currency={entry.portfolio.currency} />;

  return (
    <div className="flex">
      <ColoredNumber value={entry.result} className={className}>
        <NumberDisplay value={entry.result} currency={entry.portfolio.currency} />
      </ColoredNumber>
      {entry.returnPercentage && (
        <ColoredNumber value={entry.returnPercentage} className="ml-1">
          (<NumberDisplay value={entry.returnPercentage} isPercentage></NumberDisplay>)
        </ColoredNumber>
      )}
    </div>
  );
};

const SymbolDisplay = ({ entry }: { entry: Entry }) => {
  /* TODO: on click open chart */
  const { toast } = useToast();

  const showChart = (e: any) => {
    e.stopPropagation();
    toast({
      title: "Display Chart",
      description: `Display chart is coming soon in a future release.`,
    });
  };

  if (!entry.symbol) return <></>;
  if (entry.entryType === EntryType.DIVIDEND) return <span>{`${entry.symbol} (Dividend)`}</span>;

  return (
    <Button variant="link" className="p-0 m-0 h-0" onClick={(e) => showChart(e)}>
      {entry.symbol}
      <CandlestickChart className="h-4 w-4 ml-1" />
    </Button>
  );
};

const EntrySizeAndPrice = ({ entry }: { entry: Entry }) => {
  return (
    <div className="flex items-center justify-start">
      <div>
        <NumberDisplay value={entry.price} currency={entry.portfolio.currency} />
      </div>
      <div>
        {entry.size && (
          <>
            <span className=" text-muted-foreground text-xs ml-1">
              (<NumberDisplay value={entry.size} />)
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export const Entries = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [deleteError, setDeleteError] = useState<any>(null);

  const {
    data: entries,
    error,
    isLoading,
    isSuccess,
  } = useGetEntries(
    searchParams.get("query") || undefined,
    searchParams.get("entryType") || undefined,
    searchParams.get("status") || undefined,
    searchParams.get("direction") || undefined,
    searchParams.get("pageSize") || undefined,
    searchParams.get("page") || undefined
  );

  return (
    <>
      <PageHeader>
        <PageHeader.Title>Entries</PageHeader.Title>
        <PageHeader.Subtitle>
          <span className="hidden md:flex">View and manage your entries</span>
        </PageHeader.Subtitle>
        <PageHeader.Action>
          <AddEntryButton />
        </PageHeader.Action>
      </PageHeader>
      <EntrySearch />
      <>
        <div className="md:hidden rounded-md border min-w-full">
          <MessageDisplay message={error} variant="destructive" />
          <MessageDisplay message={deleteError} variant="destructive" />
          {isLoading && isSuccess ? (
            <TableLoading />
          ) : (
            isSuccess &&
            entries &&
            entries.data &&
            (entries.pagination.total > 0 ? (
              entries?.data?.map((entry) => (
                <Card
                  key={entry.id}
                  className="hover:bg-slate-200"
                  onClick={() => navigate(`/trading/entries/${entry.id}`)}
                >
                  <CardHeader className="space-y-0 pt-3 pb-2">
                    <CardTitle>
                      <div className="flex w-full items-center justify-between">
                        <div>
                          <div className="flex w-full items-center">
                            <div>
                              <span className="text-2xl font-semibold leading-none tracking-tight mr-2">
                                {`${entry.symbol}${
                                  entry.entryType === EntryType.DIVIDEND ? " (Divd)" : ""
                                }`}
                              </span>
                            </div>
                            <div>
                              <DirectionDisplay
                                direction={entry.direction}
                                withLabel={false}
                                size={Size.LARGE}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <EntryStatus entry={entry} />
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-0 pt-3 pb-2">
                    <EntrySizeAndPrice entry={entry} />
                  </CardContent>
                  <CardFooter>
                    <div className="flex w-full items-center justify-between pt-4">
                      <div>
                        <DateDisplay value={entry.date} />
                      </div>
                      <div className="flex justify-end pr-2">
                        <Result entry={entry} className="" />
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="mb-2 w-full rounded-md p-4">
                <div className="flex items-center justify-between">
                  <p className="text-md font-medium">No entries found.</p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="hidden rounded-md border min-w-full md:table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Open Date</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Side</TableHead>
                <TableHead>Entry</TableHead>
                <TableHead>Hold</TableHead>
                <TableHead>Result</TableHead>
                <TableHead className="w-[45px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <TableLoading />
                  </TableCell>
                </TableRow>
              ) : (
                isSuccess &&
                entries &&
                entries.data &&
                (entries.pagination.total > 0 ? (
                  entries.data.map((entry) => (
                    <TableRow
                      key={entry.id}
                      onClick={() => navigate(`/trading/entries/${entry.id}`)}
                      className="hover:cursor-pointer hover:bg-accent hover:text-accent-foreground"
                    >
                      <TableCell>
                        <DateDisplay withTime value={entry.date} />
                      </TableCell>
                      <TableCell>
                        <SymbolDisplay entry={entry} />
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <EntryStatus entry={entry} />
                      </TableCell>
                      <TableCell>
                        <DirectionDisplay direction={entry.direction} withLabel={false} />
                      </TableCell>
                      <TableCell>
                        <EntrySizeAndPrice entry={entry} />
                      </TableCell>
                      <TableCell>
                        {entry.exitDate && (
                          <DateDistance startDate={entry.date} endDate={entry.exitDate} />
                        )}
                      </TableCell>
                      <TableCell>
                        <Result entry={entry} />
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <DeleteEntryButton
                          entry={entry}
                          onError={(error) => setDeleteError(error)}
                          onSuccess={() => {}}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No entries found.
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {isSuccess && entries && <TablePagination {...entries.pagination} />}
      </>
    </>
  );
};
