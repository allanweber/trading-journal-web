import { Button } from 'components/ui/button';
import { useAuthState } from 'lib/authentication';
import { NavLink, Navigate, Outlet } from 'react-router-dom';

export const AppLayout = () => {
  const { isLoading, isAuthenticated, logout } = useAuthState();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <div className="help-layout">
      <h2>Website Help</h2>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eaque quas
        debitis quibusdam deserunt repellat hic molestias ipsum commodi aut
        odit!
      </p>

      <nav>
        <p>
          <NavLink
            className="underline underline-offset-4 hover:text-primary"
            to="journals"
          >
            Journals
          </NavLink>
        </p>
        <p>
          <NavLink
            className="underline underline-offset-4 hover:text-primary"
            to="entries"
          >
            Entries
          </NavLink>
        </p>
        <p>
          <Button onClick={() => logout()} type="button">
            LogOut
          </Button>
        </p>
      </nav>

      <Outlet />
    </div>
  );
};
