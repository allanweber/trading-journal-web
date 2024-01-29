import { Calendar as CalendarIcon, Info } from "lucide-react";

import { Separator } from "@radix-ui/react-dropdown-menu";
import { Button } from "components/ui/button";
import { Calendar } from "components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { format, isDate, isValid, parse } from "date-fns";
import { enGB } from "date-fns/locale";
import { forwardRef, useState } from "react";
import InputMask from "react-input-mask";
import { TimePicker } from "./TimePicker";

interface Props {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  withTime?: boolean;
  placeholder?: string;
  helperText?: string;
  [x: string]: any;
}
const dateFnsWithTimeFormat = "dd/MM/yyyy HH:mm";
const dateFnsFormat = "dd/MM/yyyy";

export const DateTimePicker = forwardRef(function DateTimePicker(props: Props, ref) {
  let { value, onChange, withTime, placeholder, helperText, ...rest } = props;

  if (typeof value === "string") {
    value = new Date(value);
  }

  const dateFormat = withTime ? dateFnsWithTimeFormat : dateFnsFormat;
  const mask = withTime ? "99/99/9999 99:99" : "99/99/9999";

  const [stringDate, setStringDate] = useState(
    value && isDate(value) && isValid(value) ? format(value, dateFormat) : ""
  );

  const [month, setMonth] = useState<Date>(value || new Date());

  const todayClick = () => {
    setStringDate(format(new Date(), dateFormat));
    onChange(new Date());
    setMonth(new Date());
  };

  const setTime = (date: Date | undefined) => {
    setStringDate(date ? format(date, dateFormat) : "");
    onChange(date);
    setMonth(date || new Date());
  };

  const onSelect = (date: Date | undefined) => {
    setStringDate(date ? format(date, dateFormat) : "");
    onChange(date);
  };

  const validateDateTime = (inputDateTime: string) => {
    if (inputDateTime.length === 0) {
      onChange(undefined);
    } else {
      const parsedDateTime = parse(inputDateTime, dateFormat, new Date());

      if (isDate(parsedDateTime) && isValid(parsedDateTime)) {
        onChange(parsedDateTime);
      } else {
        onChange(undefined);
      }
    }
  };

  const handleDateTimeChange = (e: { target: { value: string } }) => {
    const inputDateTime = e.target.value;
    setStringDate(inputDateTime);
    validateDateTime(inputDateTime);
  };

  return (
    <div className="w-full flex justify-normal items-center space-x-2">
      <div className="relative w-full">
        <div className="relative">
          <InputMask
            mask={mask}
            placeholder={placeholder || "DD/MM/YYYY" + (withTime ? " HH:mm" : "")}
            value={stringDate}
            onChange={handleDateTimeChange}
            onFocus={(e) => e.target.select()}
            alwaysShowMask={false}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            {...rest}
          />
          {helperText && (
            <Popover>
              <PopoverTrigger className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <Info className="h-4 w-4 text-muted-foreground" />
              </PopoverTrigger>
              <PopoverContent>
                This is the date when you did or will do your withdrawal, this is used to calculate
                your balance, and can never be changed. (required)
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={"outline"} className="" {...rest} tabIndex={-1}>
            <CalendarIcon className=" h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onSelect}
            locale={enGB}
            onMonthChange={setMonth}
            month={month}
            footer={
              <div>
                {withTime && (
                  <div className="p-3 border-t border-border">
                    <TimePicker onChange={setTime} value={value || new Date()} />
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
