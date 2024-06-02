import type { PropsWithChildren } from "react";

export const PageHeader = (props: PropsWithChildren) => {
  const { children } = props;
  return <div className="flex">{children}</div>;
};

export const Title = (props: PropsWithChildren) => {
  const { children } = props;
  return <div className="w-full flex-1 text-2xl font-medium">{children}</div>;
};

const Subtitle = (props: PropsWithChildren) => {
  const { children } = props;
  return (
    <span className="hidden md:flex text-sm font-normal text-muted-foreground">{children}</span>
  );
};

const Action = (props: PropsWithChildren) => {
  const { children } = props;
  return <div className="flex items-center gap-2">{children}</div>;
};

PageHeader.Title = Title;
PageHeader.Subtitle = Subtitle;
PageHeader.Action = Action;
