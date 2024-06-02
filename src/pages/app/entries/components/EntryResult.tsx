import ColoredNumber from "components/ColoredNumber";
import NumberDisplay from "components/NumberDisplay";
import { Entry } from "model/entry";

export const EntryResult = ({ entry }: { entry: Entry }) => {
  if (!entry.result || entry.result === 0)
    return <NumberDisplay currency={entry.portfolio.currency}>{entry.result}</NumberDisplay>;

  return (
    <div className="flex flex-col" aria-label="result">
      <ColoredNumber value={entry.result}>
        <NumberDisplay className="truncate" currency={entry.portfolio.currency}>
          {entry.result}
        </NumberDisplay>
      </ColoredNumber>
      {entry.returnPercentage && (
        <ColoredNumber value={entry.returnPercentage}>
          (
          <NumberDisplay className="truncate" isPercentage>
            {entry.returnPercentage}
          </NumberDisplay>
          )
        </ColoredNumber>
      )}
    </div>
  );
};
