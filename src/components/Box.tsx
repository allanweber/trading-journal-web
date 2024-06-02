import { cn } from "lib/utils";
import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  className?: string;
}

export const Box = (props: Props) => {
  const { children, className } = props;
  return <div className={cn("my-4 bg-card", className)}>{children}</div>;
};
