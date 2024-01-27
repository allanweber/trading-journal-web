import Search from "components/table/Search";
import { directions } from "model/direction";
import { getEntries } from "model/entryType";

export const EntrySearch = () => {
  let filters: any[] = [
    {
      filterId: "entryType",
      title: "Entry Type",
      options: getEntries.map((entry) => {
        return {
          label: entry.type,
          value: entry.type,
          icon: entry.icon,
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
        };
      }),
    },
  ];

  return <Search placeholder="Search by symbol" filters={filters} />;
};
