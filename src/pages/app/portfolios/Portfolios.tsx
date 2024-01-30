import DateDisplay from "components/DateDisplay";
import { MessageDisplay } from "components/MessageDisplay";
import { PageHeader } from "components/PageHeader";
import { TableLoading } from "components/table/TableLoading";
import { Separator } from "components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/ui/table";
import { AddPortfolioButton } from "pages/app/portfolios/components/AddPortfolioButton";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAllPortfolios } from "service/portfolioQueries";
import { DeletePortfolioButton } from "./components/DeletePortfolioButton";
import { PortfolioBalance } from "./components/PortfolioBalance";

export const Portfolios = () => {
  const navigate = useNavigate();
  const [deleteError, setDeleteError] = useState<any>(null);

  const { data: portfolios, error, isLoading, isSuccess } = useAllPortfolios();

  return (
    <>
      <PageHeader>
        <PageHeader.Title>Portfolios</PageHeader.Title>
        <PageHeader.Subtitle>
          <span className="hidden md:flex">View and manage your Portfolios</span>
        </PageHeader.Subtitle>
        <PageHeader.Action>
          <AddPortfolioButton />
        </PageHeader.Action>
      </PageHeader>
      <MessageDisplay message={error} variant="destructive" />
      <MessageDisplay message={deleteError} variant="destructive" />
      <div className="md:hidden rounded-md border min-w-full">
        {isLoading && isSuccess ? (
          <TableLoading />
        ) : (
          isSuccess &&
          portfolios?.map((portfolio) => (
            <div
              key={portfolio.id}
              className="hover:bg-slate-200"
              onClick={() => navigate(`/trading/portfolios/${portfolio.id}`)}
            >
              <div className="mb-2 w-full rounded-md p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xl font-medium">{portfolio.name}</p>
                </div>
                <div>
                  <p className="text-sm">{portfolio.description}</p>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p>
                      <DateDisplay value={portfolio.startDate} />
                    </p>
                  </div>
                  <div className="flex justify-end mb-2">
                    <PortfolioBalance
                      balance={portfolio.currentBalance!}
                      startBalance={portfolio.startBalance}
                      currency={portfolio.currency}
                    />
                  </div>
                </div>
              </div>
              <Separator />
            </div>
          ))
        )}
      </div>
      <div className="hidden rounded-md border min-w-full md:table">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead> Balance</TableHead>
              <TableHead className="w-[100px]">Currency</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <TableLoading />
                </TableCell>
              </TableRow>
            ) : (
              isSuccess &&
              portfolios &&
              (portfolios.length > 0 ? (
                portfolios.map((portfolio) => (
                  <TableRow
                    key={portfolio.id}
                    onClick={() => navigate(`/trading/portfolios/${portfolio.id}`)}
                    className="hover:cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  >
                    <TableCell className="font-medium">
                      <Link to={`/trading/portfolios/${portfolio.id}`}>{portfolio.name}</Link>
                    </TableCell>
                    <TableCell>{portfolio.description}</TableCell>
                    <TableCell>
                      <DateDisplay value={portfolio.startDate} />
                    </TableCell>
                    <TableCell>
                      <PortfolioBalance
                        balance={portfolio.currentBalance!}
                        startBalance={portfolio.startBalance}
                        currency={portfolio.currency}
                      />
                    </TableCell>
                    <TableCell>{portfolio.currency}</TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <DeletePortfolioButton
                        portfolio={portfolio}
                        onError={(error) => setDeleteError(error)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No portfolios found.
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
