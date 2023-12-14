import { PageHeader } from 'components/PageHeader';
import { AddEntryButton } from 'pages/app/entries/components/AddEntryButton';
import { EntriesTable } from './components/EntriesTable';
import { EntrySearch } from './components/EntrySearch';

export const Entries = () => {
  return (
    <>
      <PageHeader>
        <PageHeader.Title>Entries</PageHeader.Title>
        <PageHeader.Subtitle>
          <span className="hidden md:flex">View and manage your entries</span>
        </PageHeader.Subtitle>
        <PageHeader.Action>
          <AddEntryButton />
        </PageHeader.Action>
      </PageHeader>
      <EntrySearch />
      <EntriesTable />
    </>
  );
};
