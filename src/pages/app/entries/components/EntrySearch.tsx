import Search from "components/table/Search";
import { FilterOptions } from "components/table/TableFilter";
import { Award, BookmarkMinus, Circle } from "lucide-react";
import { directions } from "model/direction";
import { onlyTrades } from "model/entryType";

export const EntrySearch = () => {
  const filters: FilterOptions[] = [
    {
      filterId: "entryType",
      title: "Entry Type",
      options: onlyTrades().map((entry) => {
        return {
          label: entry.type,
          value: entry.type,
          icon: entry.icon,
        };
      }),
    },
    {
      filterId: "status",
      title: "Status",
      options: [
        {
          label: "Win",
          value: "win",
          icon: Award,
          className: "text-green-700",
        },
        {
          label: "Loss",
          value: "loss",
          icon: BookmarkMinus,
          className: "text-red-700",
        },
        {
          label: "Open",
          value: "open",
          icon: Circle,
          className: "text-gray-700",
        },
      ],
    },
    {
      filterId: "direction",
      title: "Direction",
      options: directions.map((direction) => {
        return {
          label: direction.direction,
          value: direction.direction,
          icon: direction.icon,
          className: direction.color,
        };
      }),
    },
  ];

  return <Search placeholder="Search by symbol" filters={filters} />;
};
