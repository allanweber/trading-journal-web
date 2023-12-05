import { MessageDisplay } from 'components/MessageDisplay';
import { PageHeader } from 'components/PageHeader';
import { DeleteJournalButton } from 'components/journals/DeleteJournalButton';
import { JournalForm } from 'components/journals/JournalForm';
import { TableLoading } from 'components/table/TableLoading';
import { useParams } from 'react-router-dom';
import { useGetJournal } from 'service/journalQueries';

export const EditJournal = () => {
  const { id } = useParams();
  const { data: journal, isLoading, error } = useGetJournal(id!);

  if (isLoading) {
    return <TableLoading />;
  }

  if (error) {
    return <MessageDisplay message={error} variant="destructive" />;
  }

  return (
    <>
      <PageHeader>
        <PageHeader.Title>Edit Journal</PageHeader.Title>
        <PageHeader.Subtitle>
          <span className="hidden md:flex">{journal?.name}</span>
        </PageHeader.Subtitle>
        <PageHeader.Action>
          <DeleteJournalButton journal={journal!} />
        </PageHeader.Action>
      </PageHeader>
      <JournalForm journal={journal} />
    </>
  );
};
