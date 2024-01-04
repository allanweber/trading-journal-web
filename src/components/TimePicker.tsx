import { useRef } from 'react';

import { Label } from 'components/ui/label';
import { TimePickerInput } from './TimePickerInput';
import { Button } from './ui/button';

interface Props {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
}

export const TimePicker = ({ value, onChange }: Props) => {
  const minuteRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);
  const secondRef = useRef<HTMLInputElement>(null);

  const nowClick = () => {
    const now = new Date();
    value?.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
    onChange(value);
  };

  return (
    <div className="flex items-end gap-2">
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours" className="text-xs">
          Hours
        </Label>
        <TimePickerInput
          picker="hours"
          date={value}
          setDate={onChange}
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
          date={value}
          setDate={onChange}
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
          date={value}
          setDate={onChange}
          ref={secondRef}
          onLeftFocus={() => minuteRef.current?.focus()}
        />
      </div>
      <div className="flex h-10 items-center">
        <Button variant="outline" size="sm" onClick={nowClick}>
          Now
        </Button>
      </div>
    </div>
  );
};
