import { Award, BookmarkMinus, Circle } from "lucide-react";

export enum EntryStatus {
  WIN = "WIN",
  LOSS = "LOSS",
  OPEN = "OPEN",
}

export const statuses = [
  {
    status: EntryStatus.WIN,
    icon: Award,
    color: "text-green-700",
  },
  {
    status: EntryStatus.LOSS,
    icon: BookmarkMinus,
    color: "text-red-700",
  },
  {
    status: EntryStatus.OPEN,
    icon: Circle,
    color: "text-gray-700",
  },
];
