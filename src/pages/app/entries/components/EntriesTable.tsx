import ColoredNumber from 'components/ColoredNumber';
import DateDisplay from 'components/DateDisplay';
import { MessageDisplay } from 'components/MessageDisplay';
import NumberDisplay from 'components/NumberDisplay';
import { TableLoading } from 'components/table/TableLoading';
import { TablePagination } from 'components/table/TablePagination';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from 'components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'components/ui/table';
import { EditIcon } from 'lucide-react';
import { Entry } from 'model/entry';
import { EntryType } from 'model/entryType';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useGetEntries } from 'service/entryQueries';

const ResultChange = ({ entry }: { entry: Entry }) => {
  if (!entry.result) return <span className="text-muted-foreground">Open</span>;

  return (
    <div className="flex flex-col space-y-2">
      <ColoredNumber value={entry.result}>
        <NumberDisplay value={entry.result} currency={entry.journal.currency} />
      </ColoredNumber>
      {entry.accountChange && (
        <ColoredNumber value={entry.accountChange}>
          <NumberDisplay
            value={entry.accountChange}
            isPercentage
          ></NumberDisplay>
        </ColoredNumber>
      )}
    </div>
  );
};

const Dates = ({ entry }: { entry: Entry }) => {
  return (
    <div className="flex flex-col space-y-2">
      <DateDisplay withTime value={entry.date} />
      <div>
        {entry.exitDate && <DateDisplay withTime value={entry.exitDate} />}
      </div>
    </div>
  );
};

export const EntriesTable = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    data: entries,
    error,
    isLoading,
    isSuccess,
  } = useGetEntries(
    searchParams.get('query') || undefined,
    searchParams.get('journal') || undefined,
    searchParams.get('entryType') || undefined,
    searchParams.get('direction') || undefined,
    searchParams.get('pageSize') || undefined,
    searchParams.get('page') || undefined
  );

  if (error) {
    return <MessageDisplay message={error} variant="destructive" />;
  }

  return (
    <>
      <div className="md:hidden rounded-md border min-w-full">
        {isLoading && isSuccess ? (
          <TableLoading />
        ) : (
          isSuccess &&
          entries &&
          entries.data &&
          (entries.pagination.total > 0 ? (
            entries?.data?.map((entry) => (
              <Card
                key={entry._id}
                className="hover:bg-slate-200"
                onClick={() => navigate(`/trading/entries/${entry._id}`)}
              >
                <CardHeader>
                  <CardTitle>
                    {entry.entryType === EntryType.Trade ? (
                      <>{entry.symbol}</>
                    ) : (
                      <>{entry.entryType}</>
                    )}
                  </CardTitle>
                  <CardDescription>{entry.journal.name}</CardDescription>
                </CardHeader>
                <CardContent>{/* <p>Card Content</p> */}</CardContent>
                <CardFooter>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div>
                      <p>
                        <Dates entry={entry} />
                      </p>
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
              <TableHead>Journal</TableHead>
              <TableHead>Start/Exit Dates</TableHead>
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
                  <TableRow key={entry._id}>
                    <TableCell className="font-medium">
                      <Link to={`/trading/entries/${entry._id}`}>
                        {entry.symbol}
                      </Link>
                    </TableCell>
                    <TableCell>{entry.entryType}</TableCell>
                    <TableCell>{entry.journal.name}</TableCell>
                    <TableCell>
                      <Dates entry={entry} />
                    </TableCell>
                    <TableCell>
                      <NumberDisplay
                        value={entry.price}
                        currency={entry.journal.currency}
                      />
                    </TableCell>
                    <TableCell>
                      <ResultChange entry={entry} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="max-w-[45px] flex justify-end">
                        <Link to={`/trading/entries/${entry._id}`}>
                          <EditIcon className="h-4 w-4" />
                        </Link>
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
