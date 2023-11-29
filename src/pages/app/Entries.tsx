import { AddEntryButton } from 'components/entries/AddEntryButton';
import { PageHeader } from 'components/PageHeader';

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
    </>
  );
};
