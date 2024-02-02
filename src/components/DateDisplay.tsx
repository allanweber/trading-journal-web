import { format } from "date-fns";
import { enGB } from "date-fns/locale";

const withTimeFormat = "PP hh:mm";
const dateFormat = "PP";

type Props = {
  children: Date | string | undefined;
  withTime?: boolean;
};

export default function DateDisplay(props: Props) {
  const { children, withTime } = props;
  const calendarLocale = enGB;
  const fieldFormat = withTime ? withTimeFormat : dateFormat;

  if (!children) return null;

  let date;
  if (typeof children === "string") {
    date = new Date(children);
  } else {
    date = children;
  }
  return <>{format(date, fieldFormat, { locale: calendarLocale })}</>;
}
