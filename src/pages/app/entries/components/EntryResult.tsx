import ColoredNumber from "components/ColoredNumber";
import NumberDisplay from "components/NumberDisplay";
import { Entry } from "model/entry";

export const EntryResult = ({ entry }: { entry: Entry }) => {
  if (!entry.result || entry.result === 0)
    return <NumberDisplay currency={entry.portfolio.currency}>{entry.result}</NumberDisplay>;

  return (
    <div className="flex" aria-label="result">
      <ColoredNumber value={entry.result}>
        <NumberDisplay currency={entry.portfolio.currency}>{entry.result}</NumberDisplay>
      </ColoredNumber>
      {entry.returnPercentage && (
        <ColoredNumber value={entry.returnPercentage} className="ml-1">
          (<NumberDisplay isPercentage>{entry.returnPercentage}</NumberDisplay>)
        </ColoredNumber>
      )}
    </div>
  );
};
