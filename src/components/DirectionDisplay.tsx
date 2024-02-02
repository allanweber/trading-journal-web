import { cn } from "lib/utils";
import { Direction, getDirection } from "model/direction";
import { Size } from "model/size";

type Props = {
  direction?: Direction;
  withLabel?: boolean;
  size?: Size.SMALL | Size.LARGE;
};

export const DirectionDisplay = ({ direction, withLabel = true, size = Size.SMALL }: Props) => {
  if (!direction) return <></>;

  const directionEntry = getDirection(direction);
  return (
    <>
      {directionEntry && (
        <div className="flex flex-row items-center">
          <directionEntry.icon
            className={cn(
              directionEntry.color,
              size === Size.SMALL ? "h-4 w-4" : "h-6 w-6",
              withLabel ? "mr-1" : ""
            )}
          />
          {withLabel && <span className={cn(directionEntry.color)}>{direction}</span>}
        </div>
      )}
    </>
  );
};
