import { AppLayout } from 'layouts/AppLayout';
import { RootLayout } from 'layouts/RootLayout';
import { UserLayout } from 'layouts/UserLayout';
import { About } from 'pages/About';
import { Home } from 'pages/Home';
import { Login } from 'pages/Login';
import { Trading } from 'pages/app/Trading';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import { Entries } from './app/entries/Entries';
import { NewEntry } from './app/entries/NewEntry';
import { EditJournal } from './app/journals/EditJournal';
import { Journals } from './app/journals/Journals';
import { NewJournal } from './app/journals/NewJournal';
import { UserProfile } from './app/user/UserProfile';
import { UserSettings } from './app/user/UserSettings';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
      </Route>
      <Route path="trading" element={<AppLayout />}>
        <Route index element={<Trading />} />
        <Route path="journals" element={<Journals />} />
        <Route path="journals/new" element={<NewJournal />} />
        <Route path="journals/:id" element={<EditJournal />} />
        <Route path="entries" element={<Entries />} />
        <Route path="entries/new/:tradeType" element={<NewEntry />} />
        <Route path="user" element={<UserLayout />}>
          <Route path="settings" element={<UserSettings />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>
      </Route>
    </>
  )
);
