import { Button } from "components/ui/button";
import { MoveLeft } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

export const NotFound = () => {
  const location = useLocation();
  const { pathname } = location;

  const returnTo = pathname.startsWith("/trading") ? "/trading" : "/";

  return (
    <div>
      <div className="flex flex-col items-center justify-center px-4 md:px-8 lg:px-24 py-8 ">
        <p className="text-6xl md:text-7xl lg:text-9xl font-bold tracking-wider text-gray-300">
          404
        </p>
        <p className="text-2xl md:text-3xl lg:text-5xl font-bold tracking-wider text-gray-500 mt-4">
          Page Not Found
        </p>
        <p className="text-gray-500 mt-4 pb-4 border-b-2 text-center">
          Sorry, the page you are looking for could not be found.
        </p>
        <Button asChild className="mt-6">
          <NavLink to={returnTo}>
            <MoveLeft size={16} className="mr-2" /> Return Home
          </NavLink>
        </Button>
      </div>
    </div>
  );
};
