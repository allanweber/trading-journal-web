import { NavLink, Outlet } from 'react-router-dom';

export const RootLayout = () => {
  return (
    <div className="root-layout">
      <header>
        <nav>
          <h1>Jobarouter</h1>
          <p>
            <NavLink to="/">Home</NavLink>
          </p>
          <p>
            <NavLink to="about">About</NavLink>
          </p>
          <p>
            <NavLink to="trading">Trading</NavLink>
          </p>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
