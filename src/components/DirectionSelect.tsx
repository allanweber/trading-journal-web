import { Direction, directions } from 'model/direction';
import { DirectionDisplay } from './DirectionDisplay';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

type Props = {
  onValueChange: (value: Direction) => void;
  value: Direction;
  [x: string]: any;
};

export const DirectionSelect = ({
  onValueChange,
  value: defaultValue,
  ...rest
}: Props) => {
  return (
    <RadioGroup
      defaultValue={defaultValue}
      className="flex items-start w-full"
      {...rest}
      onValueChange={(value) => onValueChange(value as Direction)}
    >
      {directions.map((direction) => (
        <div key={direction.direction} className="w-full">
          <RadioGroupItem
            className="peer sr-only"
            value={direction.direction}
            key={direction.direction}
            id={direction.direction}
          />
          <Label
            htmlFor={direction.direction}
            className="flex flex-row items-center justify-evenly rounded-md border-2 border-muted bg-popover px-3 py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary  peer-data-[state=checked]:bg-accent [&:has([data-state=checked])]:border-primary"
          >
            <DirectionDisplay direction={direction.direction} />
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};
