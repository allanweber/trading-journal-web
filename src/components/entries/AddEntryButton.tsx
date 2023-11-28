import { PlusCircle } from 'lucide-react';
import { getEntries } from 'model/entryType';
import { NavLink } from 'react-router-dom';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export const AddEntryButton = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Entry
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Add by type</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {getEntries.map((entryType: any) => (
          <DropdownMenuItem key={entryType.type} asChild>
            <NavLink to={`/trading/entries/new/${entryType.type}`}>
              <entryType.icon className="mr-2 h-4 w-4" />
              <span className="capitalize">{entryType.type.toLowerCase()}</span>
            </NavLink>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
