import { formatDistance } from "date-fns";

type Props = {
  startDate: Date;
  endDate: Date;
};

export const DateDistance = ({ startDate, endDate }: Props) => {
  if (typeof startDate === "string") {
    startDate = new Date(startDate);
  }
  if (typeof endDate === "string") {
    endDate = new Date(endDate);
  }

  console.log(startDate);
  console.log(endDate);

  const result = formatDistance(startDate, endDate);
  return <div>{result}</div>;
};
