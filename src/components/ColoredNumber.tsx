import { cn } from "lib/utils";
import type { PropsWithChildren } from "react";

type Props = {
  value: number;
  className?: string;
};

export default function ColoredNumber(props: PropsWithChildren<Props>) {
  const { children, value, className } = props;

  const positive = "text-emerald-600";
  const negative = "text-red-500";
  const positiveValue = value >= 0;

  return (
    <span className={cn(positiveValue ? positive : negative, "text-sm", className)}>
      {children}
    </span>
  );
}
