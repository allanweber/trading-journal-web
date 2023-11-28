import { format } from 'date-fns';
import { enGB } from 'date-fns/locale';

const withTimeFormat = 'PPP hh:mm b';
const dateFormat = 'PPP';

type Props = {
  value: Date | string | undefined;
  withTime?: boolean;
};

export default function DateDisplay(props: Props) {
  const { value, withTime } = props;
  const calendarLocale = enGB;
  const fieldFormat = withTime ? withTimeFormat : dateFormat;

  if (!value) return null;

  let date;
  if (typeof value === 'string') {
    date = new Date(value);
  } else {
    date = value;
  }
  return <>{format(date, fieldFormat, { locale: calendarLocale })}</>;
}
