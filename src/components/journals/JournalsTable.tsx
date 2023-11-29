import DateDisplay from 'components/DateDisplay';
import { MessageDisplay } from 'components/MessageDisplay';
import { TableLoading } from 'components/table/TableLoading';
import { TablePagination } from 'components/table/TablePagination';
import { Separator } from 'components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'components/ui/table';
import { EditIcon, TrashIcon } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useGetJournals } from 'service/journalQueries';
import JournalBalanceStatus from './JournalBalanceStatus';

export const JournalsTable = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    data: journals,
    error,
    isLoading,
    isSuccess,
  } = useGetJournals(
    searchParams.get('query') || undefined,
    searchParams.get('currency') || undefined,
    searchParams.get('pageSize') || undefined,
    searchParams.get('page') || undefined
  );

  if (error) {
    return <MessageDisplay message={error} variant="destructive" />;
  }

  return (
    <>
      <div className="md:hidden rounded-md border min-w-full">
        {isSuccess &&
          journals?.data?.map((journal) => (
            <div
              key={journal._id}
              className="hover:bg-slate-200"
              onClick={() => navigate(`/trading/journals/${journal._id}`)}
            >
              <div className="mb-2 w-full rounded-md p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xl font-medium">{journal.name}</p>
                </div>
                <div>
                  <p className="text-sm">{journal.description}</p>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p>
                      <DateDisplay value={journal.startDate} />
                    </p>
                  </div>
                  <div className="flex justify-end mb-2">
                    <JournalBalanceStatus journal={journal} />
                  </div>
                </div>
              </div>
              <Separator />
            </div>
          ))}
      </div>
      <div className="hidden rounded-md border min-w-full md:table">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead> Balance</TableHead>
              <TableHead className="w-[100px]">Currency</TableHead>
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
              journals &&
              journals.data &&
              (journals.pagination.total > 0 ? (
                journals.data.map((journal) => (
                  <TableRow key={journal._id}>
                    <TableCell className="font-medium">
                      <Link to={`/trading/journals/${journal._id}`}>
                        {journal.name}
                      </Link>
                    </TableCell>
                    <TableCell>{journal.description}</TableCell>
                    <TableCell>
                      <DateDisplay value={journal.startDate} />
                    </TableCell>
                    <TableCell>
                      <JournalBalanceStatus journal={journal} />
                    </TableCell>
                    <TableCell>{journal.currency}</TableCell>
                    <TableCell className="text-right">
                      <div className="max-w-[45px] flex justify-between">
                        <Link to={`/trading/journals/${journal._id}`}>
                          <EditIcon className="h-4 w-4" />
                        </Link>
                        <Link to={`/trading/journals/${journal._id}`}>
                          <TrashIcon className="h-4 w-4" />
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No journals found.
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {isSuccess && journals && <TablePagination {...journals.pagination} />}
    </>
  );
};
