import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { inject } from '@vercel/analytics';
import { Toaster } from 'components/ui/toaster';
import { AuthContext } from 'contexts/AuthContext';
import { router } from 'pages/Routes';
import { RouterProvider } from 'react-router-dom';
import './App.css';

if (process.env.NODE_ENV === 'production') {
  inject();
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (error.message === '401') {
        window.location.href = '/login';
      }
    },
  }),
});

function App() {
  return (
    <main>
      <AuthContext>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AuthContext>
      <Toaster />
    </main>
  );
}

export default App;
