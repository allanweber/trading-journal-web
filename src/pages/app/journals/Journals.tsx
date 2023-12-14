import { PageHeader } from 'components/PageHeader';
import { AddJournalButton } from 'pages/app/journals/components/AddJournalButton';
import { JournalSearch } from 'pages/app/journals/components/JournalSearch';
import { JournalsTable } from 'pages/app/journals/components/JournalsTable';

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
