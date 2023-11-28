import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import * as React from 'react';

import { cn } from 'lib/utils';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Separator } from '../ui/separator';

export interface FilterOptions {
  filterId: string;
  title: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

export function TableFilter(props: FilterOptions) {
  const { filterId, title, options } = props;

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedValues, setSelectedValues] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (searchParams.get(filterId)) {
      searchParams
        .get(filterId)
        ?.split(',')
        .forEach((value) => {
          setSelectedValues((prev) => new Set(prev.add(value)));
        });
    } else {
      setSelectedValues(() => new Set());
    }
  }, [searchParams, filterId]);

  const selectChanges = () => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (selectedValues.size > 0) {
      params.set(filterId, Array.from(selectedValues).join(','));
    } else {
      params.delete(filterId);
    }
    updatePath(params);
  };

  const reset = () => {
    setSelectedValues(() => new Set());
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    params.delete(filterId);
    updatePath(params);
  };

  const updatePath = (params: URLSearchParams) => {
    setSearchParams(params);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        setSelectedValues((prev) => {
                          prev.delete(option.value);
                          return new Set(prev);
                        });
                      } else {
                        setSelectedValues(
                          (prev) => new Set(prev.add(option.value))
                        );
                      }
                      return selectChanges();
                    }}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <CheckIcon className={cn('h-4 w-4')} />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => reset()}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
