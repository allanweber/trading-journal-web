import Search from "components/table/Search";
import { FilterOptions } from "components/table/TableFilter";
import { directions } from "model/direction";
import { statuses } from "model/entryStatus";
import { onlyTrades } from "model/entryType";

export const EntrySearch = () => {
  const filters: FilterOptions[] = [
    {
      filterId: "entryType",
      title: "Trade Type",
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
      options: statuses.map((status) => {
        return {
          label: status.status,
          value: status.status,
          icon: status.icon,
          className: status.color,
        };
      }),
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
