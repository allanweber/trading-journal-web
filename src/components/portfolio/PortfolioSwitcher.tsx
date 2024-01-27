import { CaretSortIcon, PlusCircledIcon } from "@radix-ui/react-icons";

import { usePortfolioContext } from "contexts/PortfolioContext";
import { CheckIcon, Table } from "lucide-react";
import { Portfolio } from "model/portfolio";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAllPortfolios } from "service/portfolioQueries";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export default function PortfolioSwitcher() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const [otherPortfolios, setOtherPortfolios] = useState<Portfolio[] | undefined>(undefined);
  const { portfolio: contextPortfolio, setPortfolio: setContextPortfolio } = usePortfolioContext();
  const { data, isSuccess } = useAllPortfolios();

  useEffect(() => {
    if (isSuccess) {
      const list = data.filter((item) => item.id !== contextPortfolio?.id);
      setOtherPortfolios(list);

      const currentNotInData = data.filter((item) => item.id === contextPortfolio?.id).length === 0;
      if (contextPortfolio === undefined || currentNotInData) {
        if (data.length > 0) {
          setContextPortfolio(data[data.length - 1]);
        } else {
          setContextPortfolio(undefined);
        }
      }
    }
  }, [isSuccess, data, contextPortfolio, setContextPortfolio]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a team"
          className="w-[200px] justify-between"
        >
          {contextPortfolio ? (
            <>
              <Avatar className="mr-2 h-5 w-5">
                <AvatarImage
                  src={`https://avatar.vercel.sh/a.png`}
                  alt={contextPortfolio?.name}
                  className="grayscale"
                />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              {contextPortfolio?.name}
              <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
            </>
          ) : (
            <span>
              <div className="flex items-center">
                <PlusCircledIcon className="mr-2 h-5 w-5" />
                First create a portfolio
              </div>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search portfolio..." />
            <CommandEmpty>No portfolios found.</CommandEmpty>
            {otherPortfolios && (
              <>
                {contextPortfolio && (
                  <CommandGroup key="CurrentPortfolio" heading="Current Portfolio">
                    <CommandItem
                      key={contextPortfolio.id}
                      onSelect={() => {
                        setOpen(false);
                      }}
                      className="text-sm"
                    >
                      <Avatar className="mr-2 h-5 w-5">
                        <AvatarImage
                          src={`https://avatar.vercel.sh/a.png`}
                          alt={contextPortfolio.name}
                          className="grayscale"
                        />
                        <AvatarFallback>SC</AvatarFallback>
                      </Avatar>
                      {contextPortfolio.name}
                      <CheckIcon className="ml-auto h-4 w-4 opacity-100" />
                    </CommandItem>
                  </CommandGroup>
                )}

                {otherPortfolios.length > 0 && (
                  <CommandGroup key="AvailablePortfolio" heading="Other Portfolio">
                    {otherPortfolios.map((portfolio) => (
                      <CommandItem
                        key={portfolio.id}
                        onSelect={() => {
                          setOpen(false);
                          setContextPortfolio(portfolio);
                        }}
                        className="text-sm"
                      >
                        <Avatar className="mr-2 h-5 w-5">
                          <AvatarImage
                            src={`https://avatar.vercel.sh/a.png`}
                            alt={portfolio.name}
                            className="grayscale"
                          />
                          <AvatarFallback>SC</AvatarFallback>
                        </Avatar>
                        {portfolio.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  navigate("/trading/portfolios/new");
                }}
              >
                <PlusCircledIcon className="mr-2 h-5 w-5" />
                Create a Portfolio
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  navigate("/trading/portfolios");
                }}
              >
                <Table className="mr-2 h-5 w-5" />
                All Portfolios
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
