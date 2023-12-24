import Search from 'components/table/Search';
import { directions } from 'model/direction';
import { getEntries } from 'model/entryType';
import { useAllJournals } from 'service/journalQueries';

export const EntrySearch = () => {
  const { data: journals, isSuccess } = useAllJournals();
  let filters: any[] = [
    {
      filterId: 'entryType',
      title: 'Entry Type',
      options: getEntries.map((entry) => {
        return {
          label: entry.type,
          value: entry.type,
          icon: entry.icon,
        };
      }),
    },
    {
      filterId: 'direction',
      title: 'Direction',
      options: directions.map((direction) => {
        return {
          label: direction.direction,
          value: direction.direction,
          icon: direction.icon,
        };
      }),
    },
  ];

  if (isSuccess && journals) {
    const journalFilter = {
      filterId: 'journal',
      title: 'Journal',
      options: journals.map((journal) => {
        return {
          label: journal.name!,
          value: journal.id!,
        };
      }),
    };
    filters.unshift(journalFilter);
  }

  return <Search placeholder="Search by symbol" filters={filters} />;
};
