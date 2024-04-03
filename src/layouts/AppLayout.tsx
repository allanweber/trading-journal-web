import { Notifications } from "components/Notifications";
import { UserNav } from "components/UserNav";
import { Icons } from "components/icons";
import { Button } from "components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "components/ui/collapsible";
import { Sheet, SheetContent, SheetTrigger } from "components/ui/sheet";
import { PortfolioProvider } from "contexts/PortfolioContext";
import { useAuthState } from "lib/authentication";
import { cn } from "lib/utils";
import { Home, LayoutList, Menu, PieChart, Plus } from "lucide-react";
import { NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAllPortfolios } from "service/portfolioQueries";

const items = [
  {
    name: "Dashboard",
    href: "/trading",
    Icon: Home,
  },
  {
    name: "Portfolios",
    href: "/trading/portfolios",
    Icon: PieChart,
  },
];

const Logo = () => (
  <NavLink to="/trading" className="flex items-center gap-2 font-semibold">
    <Icons.Logo className="h-8 w-auto" />
    <span>Trading Journal</span>
  </NavLink>
);

const PropCard = () => {
  return (
    <></>
    // <Card>
    //   <CardHeader className="p-2 pt-0 md:p-4">
    //     <CardTitle>Upgrade to Pro</CardTitle>
    //     <CardDescription>
    //       Unlock all features and get unlimited access to our support team.
    //     </CardDescription>
    //   </CardHeader>
    //   <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
    //     <Button size="sm" className="w-full">
    //       Upgrade
    //     </Button>
    //   </CardContent>
    // </Card>
  );
};

const Navigation = () => {
  const { data, isSuccess } = useAllPortfolios();
  const location = useLocation();
  const { pathname } = location;

  const isActive = (path: string) => {
    return pathname === path;
  };

  const isPortfolioActive = (portfolioId: string) => {
    const pathParts = pathname.split("/");
    return pathParts[3] === portfolioId;
  };

  return (
    <>
      {items.map((item) =>
        item.name === "Portfolios" ? (
          <Collapsible open={true} key="portfolios">
            <CollapsibleTrigger asChild>
              <NavLink
                to={item.href}
                className={cn(
                  isActive(item.href) ? "bg-muted text-primary" : "text-muted-foreground",
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
                )}
              >
                <LayoutList className="h-4 w-4" />
                {item.name}
              </NavLink>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-8">
              {isSuccess &&
                data?.map((portfolio) => (
                  <NavLink
                    key={portfolio.id}
                    to={`/trading/portfolios/${portfolio.id}`}
                    className={cn(
                      isPortfolioActive(portfolio.id!)
                        ? "bg-muted text-primary"
                        : "text-muted-foreground",
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
                    )}
                  >
                    <item.Icon className="h-4 w-4" />
                    {portfolio.name}
                  </NavLink>
                ))}
              <NavLink
                to={`/trading/portfolios/new`}
                className={cn(
                  isActive("/trading/portfolios/new")
                    ? "bg-muted text-primary"
                    : "text-muted-foreground",
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
                )}
              >
                <Plus className="h-4 w-4" />
                Add new Portfolio
              </NavLink>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <NavLink
            key={item.name}
            to={item.href}
            className={cn(
              isActive(item.href) ? "bg-muted text-primary" : "text-muted-foreground",
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
            )}
          >
            <item.Icon className="h-4 w-4" />
            {item.name}
          </NavLink>
        )
      )}
    </>
  );
};

export const AppLayout = () => {
  const { isLoading, isAuthenticated } = useAuthState();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <>
      <PortfolioProvider>
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
          <div className="hidden border-r md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
              <div className="flex h-12 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Logo />
              </div>
              <div className="flex-1">
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                  <Navigation />
                </nav>
              </div>
              <div className="mt-auto p-4">
                <PropCard />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <header className="flex h-14 items-center gap-4 px-4 border-b md:border-none md:bg-muted/40 lg:h-[60px] lg:px-6">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col">
                  <nav className="grid gap-2 text-lg font-medium">
                    <Logo />
                    <Navigation />
                  </nav>
                  <div className="mt-auto">
                    <PropCard />
                  </div>
                </SheetContent>
              </Sheet>
              <div className="w-full flex-1 md:hidden">
                <div>
                  <Logo />
                </div>
              </div>
              <Notifications />
              <UserNav />
            </header>

            <main className="flex flex-1 flex-col p-4 pt-2 md:pt-0 bg-muted/40">
              <Outlet />
            </main>
          </div>
        </div>
      </PortfolioProvider>
    </>
  );
};
