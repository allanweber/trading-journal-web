import { Calendar as CalendarIcon } from 'lucide-react';

import { Separator } from '@radix-ui/react-dropdown-menu';
import { Button } from 'components/ui/button';
import { Calendar } from 'components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { format, parse, parseISO } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { LegacyRef, useState } from 'react';
import { IMask, useIMask } from 'react-imask';
import { TimePicker } from './TimePicker';

interface Props {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  withTime?: boolean;
  placeholder?: string;
  [x: string]: any;
}
const maskFormat = 'DD/MM/YYYY';
const maskFormatWithTime = 'DD/MM/YYYY HH:mm';
const dateFnsWithTimeFormat = 'dd/MM/yyyy HH:mm';
const dateFnsFormat = 'dd/MM/yyyy';

export const DateTimePicker = ({
  date,
  setDate,
  withTime,
  placeholder,
  ...rest
}: Props) => {
  if (typeof date === 'string') {
    date = parseISO(date);
  }

  const [month, setMonth] = useState<Date>(date ?? new Date());

  const [opts] = useState({
    mask: withTime ? maskFormatWithTime : maskFormat,
    lazy: true,
    unmask: 'false',
    blocks: {
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
    },
  });

  const onComplete = (value: string) => {
    if (withTime && value.length < 16) return;
    if (value.length < 10) return;
    const format = withTime ? dateFnsWithTimeFormat : dateFnsFormat;
    const parsedDate = parse(value, format, new Date());
    if (parsedDate) {
      setDate(parsedDate);
    }
  };

  const { ref, setValue } = useIMask(opts, {
    onComplete: onComplete,
  });

  const todayClick = () => {
    setDate(new Date());
    setMonth(new Date());
    setAfterSelect(new Date());
  };

  const onSelect = (date: Date | undefined) => {
    setAfterSelect(date);
    setDate(date);
  };

  const setAfterSelect = (date: Date | undefined) => {
    if (date) {
      setValue(format(date, withTime ? dateFnsWithTimeFormat : dateFnsFormat));
    } else {
      setValue('');
    }
  };

  return (
    <div className="w-full flex justify-normal items-center space-x-2">
      <input
        defaultValue={format(
          date || new Date(),
          withTime ? dateFnsWithTimeFormat : dateFnsFormat
        )}
        placeholder={
          placeholder || withTime ? dateFnsWithTimeFormat : dateFnsFormat
        }
        type={'text'}
        className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        ref={ref as LegacyRef<HTMLInputElement>}
        onFocus={(e) => e.target.select()}
        {...rest}
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={'outline'} className="">
            <CalendarIcon className=" h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onSelect}
            locale={enGB}
            onMonthChange={setMonth}
            month={month}
            footer={
              <div>
                {withTime && (
                  <div className="p-3 border-t border-border">
                    <TimePicker setDate={setDate} date={date} />
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
};
