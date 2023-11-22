import { useAuthState } from 'lib/authentication';
import { NavLink, Navigate, Outlet } from 'react-router-dom';

export const AppLayout = () => {
  const user = useAuthState();

  if (!user) return <Navigate to="/login" />;

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
          <NavLink to="journals">Journals</NavLink>
        </p>
        <p>
          <NavLink to="entries">Entries</NavLink>
        </p>
      </nav>

      <Outlet />
    </div>
  );
};
