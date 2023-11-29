import { AddJournalButton } from 'components/journals/AddJournalButton';
import { JournalSearch } from 'components/journals/JournalSearch';
import { JournalsTable } from 'components/journals/JournalsTable';
import { PageHeader } from 'components/PageHeader';

export const Journals = () => {
  return (
    <>
      <PageHeader>
        <PageHeader.Title>Journals</PageHeader.Title>
        <PageHeader.Subtitle>
          <span className="hidden md:flex">View and manage your journals</span>
        </PageHeader.Subtitle>
        <PageHeader.Action>
          <AddJournalButton />
        </PageHeader.Action>
      </PageHeader>
      <JournalSearch />
      <JournalsTable />
    </>
  );
};
