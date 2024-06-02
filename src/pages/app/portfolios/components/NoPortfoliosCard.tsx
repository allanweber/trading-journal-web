import { AddPortfolioButton } from "./AddPortfolioButton";

export const NoPortfoliosCard = () => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-2 md:p-4">
      <div className="rounded-lg border border-dashed shadow-sm py-10">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">You have no portfolios</h3>
          <p className="text-sm text-muted-foreground">
            You can start managing your trades as soon as you add your first portfolio.
          </p>
          <div className="mt-4">
            <AddPortfolioButton />
          </div>
        </div>
      </div>
    </div>
  );
};
