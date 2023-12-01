import { Calendar as CalendarIcon } from 'lucide-react';

import { Separator } from '@radix-ui/react-dropdown-menu';
import { Button } from 'components/ui/button';
import { Calendar } from 'components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { format, parseISO } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { cn } from 'lib/utils';
import { useState } from 'react';
import { TimePicker } from './TimePicker';

interface Props {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  withTime?: boolean;
}

const withTimeFormat = 'PPP HH:mm:ss';
const dateFormat = 'PPP';

export const DateTimePicker = ({ date, setDate, withTime }: Props) => {
  if (typeof date === 'string') {
    date = parseISO(date);
  }

  const [month, setMonth] = useState<Date>(date ?? new Date());
  const showFormat = withTime ? withTimeFormat : dateFormat;

  const todayClick = () => {
    setDate(new Date());
    setMonth(new Date());
  };

  const clearClick = () => {
    setDate(undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          {date ? (
            format(date, showFormat, { locale: enGB })
          ) : (
            <span>Pick a date</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
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
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full ml-2"
                  onClick={clearClick}
                >
                  Clear
                </Button>
              </div>
            </div>
          }
        />
      </PopoverContent>
    </Popover>
  );
};
