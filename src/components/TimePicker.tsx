import { useRef } from 'react';

import { Label } from 'components/ui/label';
import { TimePickerInput } from './TimePickerInput';
import { Button } from './ui/button';

interface Props {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export const TimePicker = ({ date, setDate }: Props) => {
  const minuteRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);
  const secondRef = useRef<HTMLInputElement>(null);

  const nowClick = () => {
    const now = new Date();
    date?.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
    setDate(date);
  };

  return (
    <div className="flex items-end gap-2">
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours" className="text-xs">
          Hours
        </Label>
        <TimePickerInput
          picker="hours"
          date={date}
          setDate={setDate}
          ref={hourRef}
          onRightFocus={() => minuteRef.current?.focus()}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="minutes" className="text-xs">
          Minutes
        </Label>
        <TimePickerInput
          picker="minutes"
          date={date}
          setDate={setDate}
          ref={minuteRef}
          onLeftFocus={() => hourRef.current?.focus()}
          onRightFocus={() => secondRef.current?.focus()}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="seconds" className="text-xs">
          Seconds
        </Label>
        <TimePickerInput
          picker="seconds"
          date={date}
          setDate={setDate}
          ref={secondRef}
          onLeftFocus={() => minuteRef.current?.focus()}
        />
      </div>
      <div className="flex h-10 items-center">
        {/* <Clock className="ml-2 h-4 w-4" /> */}
        <Button variant="outline" size="sm" onClick={nowClick}>
          Now
        </Button>
      </div>
    </div>
  );
};
