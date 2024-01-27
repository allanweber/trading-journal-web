import { PlusCircle } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "../../../../components/ui/button";

export const AddPortfolioButton = () => {
  return (
    <Button asChild>
      <NavLink to="/trading/portfolios/new">
        <PlusCircle className="mr-2 h-4 w-4" />
        Add new Portfolio
      </NavLink>
    </Button>
  );
};
