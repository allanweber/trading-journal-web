import { PageHeader } from 'components/PageHeader';
import { EntryType } from 'model/entryType';
import { useNavigate, useParams } from 'react-router-dom';
import { DepositForm } from './components/DepositForm';
import DividendForm from './components/DividendForm';
import { TaxesForm } from './components/TaxesForm';
import { TradeForm } from './components/TradeForm';
import { WithdrawalForm } from './components/WithdrawalForm';

const EntryForm = ({ entryType }: { entryType: EntryType }) => {
  switch (entryType) {
    case EntryType.Trade:
      return <TradeForm />;
    case EntryType.Withdrawal:
      return <WithdrawalForm />;
    case EntryType.Deposit:
      return <DepositForm />;
    case EntryType.Taxes:
      return <TaxesForm />;
    case EntryType.Dividend:
      return <DividendForm />;
    default:
      throw new Error(`Invalid entry type: ${entryType}`);
  }
};

export const NewEntry = () => {
  const { tradeType } = useParams();
  const navigate = useNavigate();
  if (!tradeType) {
    navigate('/trading/entries');
  }

  const type = tradeType as EntryType;

  return (
    <>
      <PageHeader>
        <PageHeader.Title>{type}</PageHeader.Title>
        <PageHeader.Subtitle>
          Create a new {type.toLowerCase()} entry
        </PageHeader.Subtitle>
      </PageHeader>
      <EntryForm entryType={type} />
    </>
  );
};
