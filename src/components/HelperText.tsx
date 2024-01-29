import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { cn } from "lib/utils";
import { Info } from "lucide-react";
import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  className?: string;
}

export const HelperText = (props: Props) => {
  const { children, className } = props;
  return (
    <Popover>
      <PopoverTrigger
        className={cn("absolute right-3 top-1/2 transform -translate-y-1/2", className)}
      >
        <Info className="h-4 w-4 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent className="text-xs">{children}</PopoverContent>
    </Popover>
  );
};
