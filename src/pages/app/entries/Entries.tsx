import { Box } from "components/Box";
import DateDisplay from "components/DateDisplay";
import { DateDistance } from "components/DateDistance";
import { DirectionDisplay } from "components/DirectionDisplay";
import { MessageDisplay } from "components/MessageDisplay";
import NumberDisplay from "components/NumberDisplay";
import { PageHeader } from "components/PageHeader";
import { TableLoading } from "components/table/TableLoading";
import { TablePagination } from "components/table/TablePagination";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "components/ui/tooltip";
import { Image, StickyNote } from "lucide-react";
import { Entry, OrderStatus } from "model/entry";
import { EntryType } from "model/entryType";
import { Size } from "model/size";
import { AddTradeButton } from "pages/app/entries/components/AddTradeButton";
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useGetEntries } from "service/entryQueries";
import { DeleteEntryButton } from "./components/DeleteEntryButton";
import { EntryResult } from "./components/EntryResult";
import { EntrySearch } from "./components/EntrySearch";
import { EntryStatus } from "./components/EntryStatus";
import { SymbolDisplay } from "./components/SymbolDisplay";

const EntrySizeAndPrice = ({ entry }: { entry: Entry }) => {
  return (
    <div className="flex flex-col truncate">
      <NumberDisplay currency={entry.portfolio.currency}>{entry.price}</NumberDisplay>

      {entry.size && (
        <span className="text-muted-foreground text-xs">
          (<NumberDisplay>{entry.size}</NumberDisplay>)
        </span>
      )}
    </div>
  );
};

const NotesAndImages = ({ entry }: { entry: Entry }) => {
  return (
    <div className="flex items-center justify-end gap-1">
      {entry._count && entry._count?.images > 0 && (
        <Tooltip>
          <TooltipTrigger>
            <Image className="h-4 w-4" />
          </TooltipTrigger>
          <TooltipContent>
            <p>There are images</p>
          </TooltipContent>
        </Tooltip>
      )}
      {entry.notes && (
        <Tooltip>
          <TooltipTrigger>
            <StickyNote className="h-4 w-4" />
          </TooltipTrigger>
          <TooltipContent>
            <p>There are notes</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

export const Entries = () => {
  const { portfolioId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [deleteError, setDeleteError] = useState<any>(null);

  const {
    data: entries,
    error,
    isLoading,
    isSuccess,
  } = useGetEntries(
    portfolioId!,
    searchParams.get("query") || undefined,
    searchParams.get("entryType") || undefined,
    searchParams.get("status") || undefined,
    searchParams.get("direction") || undefined,
    searchParams.get("pageSize") || undefined,
    searchParams.get("page") || undefined
  );

  const handleClick = (entry: Entry) => {
    if (entry.orderStatus === OrderStatus.CLOSED) {
      navigate(`/trading/portfolios/${portfolioId}/entries/${entry.id}/closed`);
    } else {
      navigate(
        `/trading/portfolios/${portfolioId}/entries/${entry.entryType.toLocaleLowerCase()}/${
          entry.id
        }`
      );
    }
  };

  return (
    <>
      <PageHeader>
        <PageHeader.Title>
          Trades
          <PageHeader.Subtitle>View and manage your trades</PageHeader.Subtitle>
        </PageHeader.Title>

        <PageHeader.Action>
          <AddTradeButton />
        </PageHeader.Action>
      </PageHeader>

      <div className="pt-2">
        <EntrySearch />
      </div>
      <Box>
        <div className="md:hidden rounded-md border min-w-full" aria-label="entries">
          <MessageDisplay message={error} variant="destructive" />
          <MessageDisplay message={deleteError} variant="destructive" />
          {isLoading && isSuccess ? (
            <TableLoading />
          ) : (
            isSuccess &&
            entries &&
            entries.data &&
            (entries.pagination.total > 0 ? (
              entries?.data?.map((entry, index) => (
                <Card
                  key={entry.id}
                  className="hover:bg-slate-200"
                  onClick={() => handleClick(entry)}
                  aria-label={`entry-${index}`}
                >
                  <CardHeader className="space-y-0 pt-3 pb-2" aria-label="header">
                    <CardTitle>
                      <div className="flex w-full items-center justify-between">
                        <div>
                          <div className="flex w-full items-center gap-2">
                            <div>
                              <span
                                className="text-2xl font-semibold leading-none tracking-tight"
                                aria-label="entry name"
                              >
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
                            <NotesAndImages entry={entry} />
                          </div>
                        </div>
                        <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                          <EntryStatus entry={entry} />
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-0 pt-3 pb-2">
                    <div className="flex w-full items-center justify-between">
                      <div>
                        <EntrySizeAndPrice entry={entry} />
                      </div>
                      <div className="flex justify-end">
                        {entry.exitDate && (
                          <DateDistance startDate={entry.date} endDate={entry.exitDate} />
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex w-full items-center justify-between pt-4">
                      <div aria-label="date">
                        <DateDisplay>{entry.date}</DateDisplay>
                      </div>
                      <div className="flex justify-end pr-2">
                        <EntryResult entry={entry} />
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="mb-2 w-full rounded-md p-4">
                <div className="flex items-center justify-between">
                  <p className="text-md font-medium">No trades found.</p>
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
                  entries.data.map((entry, index) => (
                    <TableRow
                      key={entry.id}
                      onClick={() => handleClick(entry)}
                      className="hover:cursor-pointer hover:bg-accent hover:text-accent-foreground"
                      aria-label={`entry-${index}`}
                    >
                      <TableCell>
                        <DateDisplay withTime>{entry.date}</DateDisplay>
                      </TableCell>
                      <TableCell>
                        <SymbolDisplay entry={entry} className="p-0 m-0 h-0" />
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
                        <EntryResult entry={entry} />
                      </TableCell>
                      <TableCell className="text-right">
                        <NotesAndImages entry={entry} />
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
                    <TableCell colSpan={9} className="h-24 text-center">
                      No trades found.
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Box>
      {isSuccess && entries && <TablePagination {...entries.pagination} />}
    </>
  );
};
