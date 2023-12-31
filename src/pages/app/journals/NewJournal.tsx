import { PageHeader } from 'components/PageHeader';
import { JournalForm } from 'pages/app/journals/components/JournalForm';

export const NewJournal = () => {
  return (
    <>
      <PageHeader>
        <PageHeader.Title>Add Journal</PageHeader.Title>
        <PageHeader.Subtitle>
          <span className="hidden md:flex">
            Create a new journal to add entries
          </span>
        </PageHeader.Subtitle>
      </PageHeader>
      <JournalForm />
    </>
  );
};
