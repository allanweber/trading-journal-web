import { PlusCircle } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "../../../../components/ui/button";

export const AddPortfolioButton = () => {
  return (
    <Button asChild size="sm" className="gap-1">
      <NavLink to="/trading/portfolios/new">
        <PlusCircle className="h-3.5 w-3.5" />
        <span className="">Add new Portfolio</span>
      </NavLink>
    </Button>
  );
};
