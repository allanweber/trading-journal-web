import { cn } from 'lib/utils';
import { NavLink, useLocation } from 'react-router-dom';
import { buttonVariants } from './ui/button';

const items = [
  {
    key: 'Settings',
    href: 'trading/user/settings',
  },
  {
    key: 'Profile',
    href: 'trading/user/profile',
  },
];

export const UserSideNav = () => {
  const location = useLocation();
  const { pathname } = location;

  return (
    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
      {items.map((item) => (
        <NavLink
          key={item.href}
          to={`/${item.href}`}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            pathname === `/${item.href}`
              ? 'bg-muted hover:bg-muted'
              : 'hover:bg-transparent hover:underline',
            'justify-start'
          )}
        >
          {item.key}
        </NavLink>
      ))}
    </nav>
  );
};
