import { cn } from 'lib/utils';
import { LegacyRef, forwardRef } from 'react';

type Props = {
  value: string | undefined | null;
  onChange: (value: string | undefined) => void;
  className?: string;
  [x: string]: any;
};

export const TextArea = forwardRef(function TextArea(props: Props, ref) {
  const { value, onChange, className, ...rest } = props;
  let current = value;

  if (current === null || current === undefined) {
    current = '';
    // onChange(undefined);
  }

  const handleChange = (value: string | undefined) => {
    if (value === '') value = undefined;
    onChange(value);
  };

  return (
    <textarea
      onChange={(e) => handleChange(e.target.value)}
      value={current}
      className={cn(
        'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref as LegacyRef<HTMLTextAreaElement>}
      {...rest}
    />
  );
});
