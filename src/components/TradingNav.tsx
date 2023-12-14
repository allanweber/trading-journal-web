import { Disclosure } from '@headlessui/react';
import { cn } from 'lib/utils';
import { Menu, X } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { UserNav } from '../pages/app/user/components/UserNav';
import { Icons } from './icons';

const items = [
  {
    name: 'Dashboard',
    href: '/trading',
  },
  {
    name: 'Journals',
    href: '/trading/journals',
  },
  {
    name: 'Entries',
    href: '/trading/entries',
  },
];

export default function TradingNav() {
  const location = useLocation();
  const { pathname } = location;

  const isActive = (path: string) => {
    const pathParts = path.split('/');
    const pathNameParts = pathname.split('/');

    if (pathParts.length > 2 && pathNameParts.length > 2) {
      return pathNameParts[2].startsWith(pathParts[2]);
    }

    return path === pathname;
  };

  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open, close }) => (
        <>
          <div className="px-4">
            <div className="relative flex justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <X className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  <NavLink to="/trading">
                    <Icons.Logo className="h-8 w-auto" />
                  </NavLink>
                </div>

                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {items.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={cn(
                        isActive(item.href)
                          ? 'border-gray-900 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                        'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                      )}
                      aria-current={item.href === pathname ? 'page' : undefined}
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <UserNav />
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="pt-2 pb-4 space-y-1">
              {items.map((item) => (
                <NavLink
                  onClick={() => close()}
                  key={item.name}
                  to={item.href}
                  className={cn(
                    isActive(item.href)
                      ? 'bg-gray-50 border-gray-500 text-gray-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700',
                    'block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
                  )}
                  aria-current={item.href === pathname ? 'page' : undefined}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
