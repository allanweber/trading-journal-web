import { Calendar as CalendarIcon } from 'lucide-react';

import { Button } from 'components/ui/button';
import { Calendar } from 'components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { format, parseISO } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { cn } from 'lib/utils';
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

  const showFormat = withTime ? withTimeFormat : dateFormat;

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
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, showFormat, { locale: enGB })
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
        {withTime && (
          <div className="p-3 border-t border-border">
            <TimePicker setDate={setDate} date={date} />
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
