'use client';

import { Cross2Icon } from '@radix-ui/react-icons';
import { Ref, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { FilterOptions, TableFilter } from './TableFilter';

type Props = {
  placeholder: string;
  filters?: FilterOptions[];
};

export default function Search(props: Props) {
  const { placeholder, filters } = props;
  const [filtering, setFiltering] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setFiltering(false);
    if (searchParams.get('query')) {
      setFiltering(true);
    }
    filters?.forEach((filter) => {
      if (searchParams.get(filter.filterId)) {
        setFiltering(true);
      }
    });
  }, [searchParams, filters]);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      setFiltering(true);
      params.set('query', term);
    } else {
      params.delete('query');
    }
    updatePath(params);
  }, 300);

  const reset = () => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    params.delete('query');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    filters?.forEach((filter) => {
      params.delete(filter.filterId);
    });
    setFiltering(false);
    updatePath(params);
  };

  const updatePath = (params: URLSearchParams) => {
    setSearchParams(params);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          className="h-8 w-[150px] lg:w-[250px]"
          ref={inputRef as Ref<HTMLInputElement>}
          placeholder={placeholder}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          defaultValue={searchParams.get('query')?.toString()}
        />
        {filters?.map((filter) => (
          <TableFilter key={filter.filterId} {...filter} />
        ))}
        {filtering && (
          <Button variant="ghost" onClick={reset} className="h-8 px-2 lg:px-3">
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
