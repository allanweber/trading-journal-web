import { PageHeader } from 'components/PageHeader';
import { UserSideNav } from 'pages/app/user/components/UserSideNav';
import { Outlet } from 'react-router-dom';

export const UserLayout = () => {
  return (
    <>
      <PageHeader>
        <PageHeader.Title>Manage your account</PageHeader.Title>
      </PageHeader>

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className=" lg:w-1/5">
          <UserSideNav />
        </aside>
        <div className="flex-1 lg:max-w-xl">
          <Outlet />
        </div>
      </div>
    </>
  );
};
