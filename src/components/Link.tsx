import { cn } from 'lib/utils';
import React from 'react';
import { NavLink } from 'react-router-dom';

type Props = {
  to: string;
  className?: string;
  children: React.ReactNode;
};

export const Link = (props: Props) => {
  const { to, children, className } = props;
  return (
    <NavLink
      className={cn(
        'underline underline-offset-4 hover:text-primary',
        className
      )}
      to={to}
    >
      {children}
    </NavLink>
  );
};
