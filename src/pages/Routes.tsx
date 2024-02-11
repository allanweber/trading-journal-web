import { AppLayout } from "layouts/AppLayout";
import { RootLayout } from "layouts/RootLayout";
import { UserLayout } from "layouts/UserLayout";
import { About } from "pages/About";
import { Home } from "pages/Home";
import { Login } from "pages/Login";
import { Trading } from "pages/app/Trading";
import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { NotFound } from "./app/NotFound";
import { EditEntry } from "./app/entries/EditEntry";
import { Entries } from "./app/entries/Entries";
import { NewEntry } from "./app/entries/NewEntry";
import { EditPortfolio } from "./app/portfolios/EditPortfolio";
import { NewPortfolio } from "./app/portfolios/NewPortfolio";
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
        <Route path="portfolios/new" element={<NewPortfolio />} />
        <Route path="portfolios/:id" element={<EditPortfolio />} />
        <Route path="entries" element={<Entries />} />
        <Route path="entries/new/:tradeType" element={<NewEntry />} />
        <Route path="entries/:id" element={<EditEntry />} />
        <Route path="user" element={<UserLayout />}>
          <Route path="settings" element={<UserSettings />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </>
  )
);
