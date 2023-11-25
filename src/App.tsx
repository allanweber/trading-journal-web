import { inject } from '@vercel/analytics';
import { AuthContext } from 'contexts/AuthContext';
import { router } from 'pages/Routes';
import { RouterProvider } from 'react-router-dom';
import './App.css';

inject();

function App() {
  return (
    <main>
      <AuthContext>
        <RouterProvider router={router} />
      </AuthContext>
    </main>
  );
}

export default App;
