import ColoredNumber from 'components/ColoredNumber';
import NumberDisplay from 'components/NumberDisplay';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { Journal } from 'model/journal';

type Props = {
  journal: Journal;
};

export default function JournalBalanceStatus(props: Props) {
  const { journal } = props;
  const startBalance = journal.startBalance;
  const currentBalance = journal.currentBalance ?? 0;

  return (
    <div className="flex space-y-2">
      {currentBalance > startBalance ? (
        <TrendingUp
          className="h-5 w-5 text-green-600 mt-2 mr-2"
          aria-hidden="true"
        />
      ) : currentBalance < startBalance ? (
        <TrendingDown
          className="h-5 w-5 text-red-600 mt-2 mr-2"
          aria-hidden="true"
        />
      ) : null}
      {journal.currentBalance && (
        <ColoredNumber value={journal.currentBalance}>
          <NumberDisplay
            value={journal.currentBalance}
            currency={journal.currency}
          />
        </ColoredNumber>
      )}
    </div>
  );
}
