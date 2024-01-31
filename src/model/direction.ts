import { TrendingDown, TrendingUp } from "lucide-react";

export enum Direction {
  Long = "LONG",
  Short = "SHORT",
}

export const directions = [
  {
    direction: Direction.Long,
    icon: TrendingUp,
    color: "text-green-700",
  },
  {
    direction: Direction.Short,
    icon: TrendingDown,
    color: "text-red-700",
  },
];

export const getDirection = (direction: Direction) =>
  directions.find((d) => d.direction === direction);
