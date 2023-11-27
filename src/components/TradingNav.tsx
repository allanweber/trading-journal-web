'use client';

import { cn } from 'lib/utils';
import { NavLink, useLocation } from 'react-router-dom';
import { Icons } from './icons';

const items = [
  {
    key: 'Dashboard',
    href: 'trading',
  },
  {
    key: 'Journals',
    href: 'trading/journals',
  },
  {
    key: 'Entries',
    href: 'trading/entries',
  },
];

export default function TradingNav() {
  const location = useLocation();
  const { pathname } = location;

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
      <NavLink to={'/trading'}>
        <Icons.Logo className="h-8 w-8" />
      </NavLink>

      {items.map((item) => (
        <NavLink
          key={item.href}
          to={`/${item.href}`}
          className={cn(
            'text-muted-foreground ',
            pathname === `/${item.href}`
              ? 'text-primary border-b border-gray-900'
              : null,
            'text-sm font-medium transition-colors hover:text-primary'
          )}
        >
          {pathname === `/${item.href}` ? (
            <h1>{item.key}</h1>
          ) : (
            <span>{item.key}</span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
