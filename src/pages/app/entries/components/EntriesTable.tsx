import { Separator } from '@radix-ui/react-dropdown-menu';
import ColoredNumber from 'components/ColoredNumber';
import DateDisplay from 'components/DateDisplay';
import { MessageDisplay } from 'components/MessageDisplay';
import NumberDisplay from 'components/NumberDisplay';
import { TableLoading } from 'components/table/TableLoading';
import { TablePagination } from 'components/table/TablePagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'components/ui/table';
import { EditIcon } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useGetEntries } from 'service/entryQueries';

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
              <div
                key={entry._id}
                className="hover:bg-slate-200"
                onClick={() => navigate(`/trading/entries/${entry._id}`)}
              >
                <div className="mb-2 w-full rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-medium">{entry.symbol}</p>
                  </div>
                  <div>
                    <p className="text-sm">{entry.entryType}</p>
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div>
                      <p>
                        <DateDisplay value={entry.date} />
                      </p>
                    </div>
                    <div className="flex justify-end mb-2">
                      <NumberDisplay
                        value={entry.price}
                        //   currency={entry.currency}
                      />
                    </div>
                  </div>
                </div>
                <Separator />
              </div>
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
              <TableHead>Date</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="w-[100px]">Result</TableHead>
              <TableHead className="w-[100px]"></TableHead>
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
                      <Link to={`/trading/journals/${entry._id}`}>
                        {entry.symbol}
                      </Link>
                    </TableCell>
                    <TableCell>{entry.entryType}</TableCell>
                    <TableCell>
                      <DateDisplay value={entry.date} />
                    </TableCell>
                    <TableCell>
                      <NumberDisplay
                        value={entry.price}
                        //   currency={entry.currency}
                      />
                    </TableCell>
                    <TableCell>
                      <ColoredNumber value={entry.result}>
                        <NumberDisplay
                          value={entry.result}
                          //   currency={entry.currency}
                        />
                      </ColoredNumber>
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
