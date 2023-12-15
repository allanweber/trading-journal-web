import { MessageDisplay } from 'components/MessageDisplay';
import { PageHeader } from 'components/PageHeader';
import { TableLoading } from 'components/table/TableLoading';
import {
  Entry,
  depositSchema,
  dividendSchema,
  taxesSchema,
  tradeSchema,
  withdrawalSchema,
} from 'model/entry';
import { EntryType } from 'model/entryType';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetEntry } from 'service/entryQueries';
import { DeleteEntryButton } from './components/DeleteEntryButton';
import { DepositForm } from './components/DepositForm';
import DividendForm from './components/DividendForm';
import { TaxesForm } from './components/TaxesForm';
import { TradeForm } from './components/TradeForm';
import { WithdrawalForm } from './components/WithdrawalForm';

const EntryForm = ({ entry }: { entry: Entry }) => {
  switch (entry.entryType) {
    case EntryType.Trade:
      return <TradeForm trade={tradeSchema.parse(entry)} />;
    case EntryType.Withdrawal:
      return <WithdrawalForm withdrawal={withdrawalSchema.parse(entry)} />;
    case EntryType.Deposit:
      return <DepositForm deposit={depositSchema.parse(entry)} />;
    case EntryType.Taxes:
      return <TaxesForm taxes={taxesSchema.parse(entry)} />;
    case EntryType.Dividend:
      return <DividendForm dividend={dividendSchema.parse(entry)} />;
    default:
      throw new Error(`Invalid entry type: ${entry.entryType}`);
  }
};

export const EditEntry = () => {
  const { id } = useParams();

  const [error, setError] = useState<any>(null);
  const {
    data: entry,
    isLoading,
    isSuccess,
    error: queryError,
  } = useGetEntry(id!);

  if (isLoading) {
    return <TableLoading />;
  }

  if (queryError) {
    setError(queryError);
  }

  if (error) {
    return <MessageDisplay message={error} variant="destructive" />;
  }

  if (isSuccess && !entry) {
    return <MessageDisplay message="Entry not found" variant="destructive" />;
  }

  const onError = (error: any) => {
    setError(error);
  };

  return (
    <>
      <PageHeader>
        <PageHeader.Title>
          Edit{' '}
          {entry?.entryType === EntryType.Trade ? entry.symbol : 'Withdrawal'}
        </PageHeader.Title>
        <PageHeader.Subtitle>
          Entry from {entry?.journal.name} journal
        </PageHeader.Subtitle>
        <PageHeader.Action>
          <DeleteEntryButton entry={entry!} onError={onError} />
        </PageHeader.Action>
      </PageHeader>
      <EntryForm entry={entry!} />
    </>
  );
};
