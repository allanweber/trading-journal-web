import Search from "components/table/Search";
import { Award, BookmarkMinus, Circle } from "lucide-react";
import { directions } from "model/direction";
import { onlyTrades } from "model/entryType";

export const EntrySearch = () => {
  const filters: any[] = [
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
        },
        {
          label: "Loss",
          value: "loss",
          icon: BookmarkMinus,
        },
        {
          label: "Open",
          value: "open",
          icon: Circle,
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
        };
      }),
    },
  ];

  return <Search placeholder="Search by symbol" filters={filters} />;
};
