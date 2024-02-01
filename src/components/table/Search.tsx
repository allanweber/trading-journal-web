"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Ref, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FilterOptions, TableFilter } from "./TableFilter";

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
    if (searchParams.get("query")) {
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
    params.set("page", "1");
    if (term) {
      setFiltering(true);
      params.set("query", term);
    } else {
      params.delete("query");
    }
    updatePath(params);
  }, 300);

  const reset = () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.delete("query");
    if (inputRef.current) {
      inputRef.current.value = "";
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
    <div className="grid grid-cols-12 gap-3">
      <div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-2">
        <Input
          className="h-8"
          ref={inputRef as Ref<HTMLInputElement>}
          placeholder={placeholder}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          defaultValue={searchParams.get("query")?.toString()}
        />
      </div>
      <div className="col-span-12 sm:col-span-6 md:col-span-8 space-x-1">
        {filters?.map((filter) => (
          <TableFilter key={filter.filterId} {...filter} />
        ))}
        {filtering && (
          <Button variant="link" onClick={reset} className="m-0 h-0">
            Reset
            <Cross2Icon className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
