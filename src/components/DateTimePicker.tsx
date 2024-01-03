import { Calendar as CalendarIcon } from 'lucide-react';

import { Separator } from '@radix-ui/react-dropdown-menu';
import { Button } from 'components/ui/button';
import { Calendar } from 'components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { format, parse } from 'date-fns';
import { enGB } from 'date-fns/locale';
import parseJSON from 'date-fns/parseJSON';
import { forwardRef, useEffect, useState } from 'react';
import { IMask, IMaskInput } from 'react-imask';
import { TimePicker } from './TimePicker';

interface Props {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  withTime?: boolean;
  placeholder?: string;
  [x: string]: any;
}
const maskFormat = 'DD/MM/YYYY';
const maskFormatWithTime = 'DD/MM/YYYY HH:mm';
const dateFnsWithTimeFormat = 'dd/MM/yyyy HH:mm';
const dateFnsFormat = 'dd/MM/yyyy';

export const DateTimePicker = forwardRef(function DateTimePicker(
  props: Props,
  ref
) {
  let { value, onChange, withTime, placeholder, ...rest } = props;
  const [current, setCurrent] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (value === undefined || value === null) {
      setCurrent(undefined);
    } else {
      if (typeof value === 'string') {
        setCurrent(parseJSON(value));
      } else {
        setCurrent(value);
      }
    }
  }, [value]);

  const dateFormat = withTime ? dateFnsWithTimeFormat : dateFnsFormat;

  const [month, setMonth] = useState<Date>(current || new Date());

  const todayClick = () => {
    onChange(new Date());
    setMonth(new Date());
  };

  const onSelect = (date: Date | undefined) => {
    onChange(date);
  };

  return (
    <div className="w-full flex justify-normal items-center space-x-2">
      <IMaskInput
        ref={ref}
        mask={withTime ? maskFormatWithTime : maskFormat}
        lazy={true}
        unmask={false}
        blocks={{
          DD: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 31,
          },
          MM: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 12,
          },
          YYYY: {
            mask: IMask.MaskedRange,
            from: 1970,
            to: 2030,
          },
          HH: {
            mask: IMask.MaskedRange,
            from: 0,
            to: 23,
          },
          mm: {
            mask: IMask.MaskedRange,
            from: 0,
            to: 59,
          },
        }}
        value={current ? format(current, dateFormat) : undefined}
        onAccept={(val) => {
          if (!val || val.length === 0) {
            setCurrent((e) => undefined);
            setMonth(new Date());
            onChange(undefined);
          } else {
            if (withTime && val.length < 16) return;
            if (val.length < 10) return;
            const parsedDate = parse(val, dateFormat, new Date());
            if (parsedDate) {
              setMonth(parsedDate);
              onChange(parsedDate);
            }
          }
        }}
        onFocus={(e) => e.target.select()}
        placeholder={placeholder || 'DD/MM/YYYY' + (withTime ? ' HH:mm' : '')}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        {...rest}
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={'outline'} className="" {...rest} tabIndex={-1}>
            <CalendarIcon className=" h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={current}
            onSelect={onSelect}
            locale={enGB}
            onMonthChange={setMonth}
            month={month}
            footer={
              <div>
                {withTime && (
                  <div className="p-3 border-t border-border">
                    <TimePicker setDate={onChange} date={current} />
                  </div>
                )}
                <Separator className="mb-2 mt-2" />
                <div className="flex justify-center">
                  <Button size="sm" className="w-full" onClick={todayClick}>
                    Today
                  </Button>
                </div>
              </div>
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
});
