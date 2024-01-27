import ColoredNumber from "components/ColoredNumber";
import DateDisplay from "components/DateDisplay";
import { MessageDisplay } from "components/MessageDisplay";
import NumberDisplay from "components/NumberDisplay";
import { TableLoading } from "components/table/TableLoading";
import { TablePagination } from "components/table/TablePagination";
import { Button } from "components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/ui/table";
import { EditIcon } from "lucide-react";
import { Entry } from "model/entry";
import { EntryType } from "model/entryType";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useGetEntries } from "service/entryQueries";
import { DeleteEntryButton } from "./DeleteEntryButton";

const ResultChange = ({ entry }: { entry: Entry }) => {
  if (!entry.result) return <span className="text-muted-foreground">Open</span>;

  return (
    <div className="flex flex-col space-y-2">
      <ColoredNumber value={entry.result}>
        <NumberDisplay value={entry.result} currency={entry.portfolio.currency} />
      </ColoredNumber>
      {entry.accountChange && (
        <ColoredNumber value={entry.accountChange}>
          <NumberDisplay value={entry.accountChange} isPercentage></NumberDisplay>
        </ColoredNumber>
      )}
    </div>
  );
};

const Dates = ({ entry }: { entry: Entry }) => {
  return (
    <div className="flex flex-col space-y-2">
      <div>
        <DateDisplay withTime value={entry.date} />
      </div>
      <div>
        {entry.exitDate && entry.entryType === EntryType.STOCK && (
          <DateDisplay withTime value={entry.exitDate} />
        )}
      </div>
    </div>
  );
};

export const EntriesTable = () => {
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
    searchParams.get("direction") || undefined,
    searchParams.get("pageSize") || undefined,
    searchParams.get("page") || undefined
  );

  if (error) {
    return <MessageDisplay message={error} variant="destructive" />;
  }

  return (
    <>
      <div className="md:hidden rounded-md border min-w-full">
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
                <CardHeader>
                  <CardTitle>
                    {entry.entryType === EntryType.STOCK ? (
                      <>{entry.symbol}</>
                    ) : (
                      <>{entry.entryType}</>
                    )}
                  </CardTitle>
                  {/* <CardDescription>{entry.portfolio.name}</CardDescription> */}
                </CardHeader>
                <CardContent>{/* <p>Card Content</p> */}</CardContent>
                <CardFooter>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div>
                      <Dates entry={entry} />
                    </div>
                    <div className="flex justify-end">
                      <ResultChange entry={entry} />
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
              <TableHead>Symbol</TableHead>
              <TableHead>Entry Type</TableHead>
              <TableHead>Start/Exit Date</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Result/Change</TableHead>
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
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">
                      <Link to={`/trading/entries/${entry.id}`}>{entry.symbol}</Link>
                    </TableCell>
                    <TableCell>{entry.entryType}</TableCell>
                    <TableCell>
                      <Dates entry={entry} />
                    </TableCell>
                    <TableCell>
                      <NumberDisplay value={entry.price} currency={entry.portfolio.currency} />
                    </TableCell>
                    <TableCell>
                      <ResultChange entry={entry} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <Button variant="ghost" size="sm">
                          <Link to={`/trading/entries/${entry.id}`}>
                            <EditIcon className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DeleteEntryButton
                          entry={entry}
                          onError={(error) => setDeleteError(error)}
                          onSuccess={() => {}}
                        />
                      </div>
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
  );
};
