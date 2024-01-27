import { Portfolio } from "model/portfolio";
import { createContext, useContext, useState } from "react";

type ContextType = {
  portfolio: Portfolio | undefined;
  setPortfolio: (portfolio: Portfolio | undefined) => void;
};

const PortfolioContext = createContext<ContextType>({} as ContextType);

function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [portfolio, setPortfolio] = useState<ContextType["portfolio"] | undefined>(undefined);

  const value = {
    portfolio,
    setPortfolio,
  };

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

const usePortfolioContext = () => useContext(PortfolioContext);

export { PortfolioContext, PortfolioProvider, usePortfolioContext };
