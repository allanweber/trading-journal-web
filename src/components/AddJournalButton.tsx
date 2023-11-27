import { PlusCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Button } from './ui/button';

export const AddJournalButton = () => {
  return (
    <Button asChild>
      <NavLink to="/trading/journals/new">
        <PlusCircle className="mr-2 h-4 w-4" />
        Add new journal
      </NavLink>
    </Button>
  );
};
