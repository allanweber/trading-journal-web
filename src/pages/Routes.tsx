import { AppLayout } from "layouts/AppLayout";
import { PortfolioLayout } from "layouts/PortfolioLayout";
import { RootLayout } from "layouts/RootLayout";
import { UserLayout } from "layouts/UserLayout";
import { About } from "pages/About";
import { Home } from "pages/Home";
import { Login } from "pages/Login";
import { Trading } from "pages/app/Trading";
import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { NotFound } from "./app/NotFound";
import { ClosedEntry } from "./app/entries/ClosedEntry";
import { Dividend } from "./app/entries/Dividend";
import { Entries } from "./app/entries/Entries";
import { Stock } from "./app/entries/Stock";
import { Portfolio } from "./app/portfolios/Portfolio";
import { Portfolios } from "./app/portfolios/Portfolios";
import { UserProfile } from "./app/user/UserProfile";
import { UserSettings } from "./app/user/UserSettings";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="trading" element={<AppLayout />}>
        <Route index element={<Trading />} />
        <Route path="portfolios" element={<Portfolios />} />
        <Route path="portfolios/new" element={<Portfolio />} />
        <Route path="portfolios/:portfolioId/edit" element={<Portfolio />} />
        <Route path="portfolios/:portfolioId" element={<PortfolioLayout />}>
          <Route path="entries" element={<Entries />} />
          <Route path="entries/:entryId/closed" element={<ClosedEntry />} />
          <Route path="entries/stock/new" element={<Stock />} />
          <Route path="entries/stock/:entryId" element={<Stock />} />
          <Route path="entries/dividend/new" element={<Dividend />} />
          <Route path="entries/dividend/:entryId" element={<Dividend />} />
        </Route>
        <Route path="user" element={<UserLayout />}>
          <Route path="settings" element={<UserSettings />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </>
  )
);
