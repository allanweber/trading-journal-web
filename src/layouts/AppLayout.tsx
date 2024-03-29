import TradingNav from 'components/TradingNav';
import { PortfolioProvider } from 'contexts/PortfolioContext';
import { useAuthState } from 'lib/authentication';
import { Navigate, Outlet } from 'react-router-dom';

export const AppLayout = () => {
  const { isLoading, isAuthenticated } = useAuthState();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <>
      <PortfolioProvider>
        <TradingNav />
        <div className="flex-1 space-y-4 p-2 md:p-4 pt-2 md:pt-6">
          <Outlet />
        </div>
      </PortfolioProvider>
    </>
  );
};
