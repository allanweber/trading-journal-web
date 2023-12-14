import ColoredNumber from 'components/ColoredNumber';
import NumberDisplay from 'components/NumberDisplay';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { Journal } from 'model/journal';

type Props = {
  journal: Journal;
};

export default function JournalBalanceStatus(props: Props) {
  const { journal } = props;
  const growing =
    (journal.balance ? journal.balance.current : 0) >= journal.startBalance;
  return (
    <div className="flex space-y-2">
      {growing ? (
        <TrendingUp
          className="h-5 w-5 text-green-600 mt-2 mr-2"
          aria-hidden="true"
        />
      ) : (
        <TrendingDown
          className="h-5 w-5 text-red-600 mt-2 mr-2"
          aria-hidden="true"
        />
      )}
      {journal.balance && (
        <ColoredNumber value={journal.balance.current}>
          <NumberDisplay
            value={journal.balance.current}
            currency={journal.currency}
          />
        </ColoredNumber>
      )}
    </div>
  );
}
