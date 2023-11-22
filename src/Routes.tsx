import { AppLayout } from 'layouts/AppLayout';
import { RootLayout } from 'layouts/RootLayout';
import { About } from 'pages/About';
import { Home } from 'pages/Home';
import { Login } from 'pages/Login';
import { Trading } from 'pages/app/Trading';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="login" element={<Login />} />
      <Route path="trading" element={<AppLayout />}>
        <Route index element={<Trading />} />
      </Route>
    </Route>
  )
);
