import TradingNav from 'components/TradingNav';
import { UserNav } from 'components/UserNav';
import { useAuthState } from 'lib/authentication';
import { Navigate, Outlet } from 'react-router-dom';

export const AppLayout = () => {
  const { isLoading, isAuthenticated } = useAuthState();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <>
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <TradingNav />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Outlet />
      </div>
    </>
  );
};
