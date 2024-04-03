import { TooltipProvider } from "@radix-ui/react-tooltip";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { inject } from "@vercel/analytics";
import { Toaster } from "components/ui/toaster";
import { AuthContext } from "contexts/AuthContext";
import { router } from "pages/Routes";
import { RouterProvider } from "react-router-dom";
import "./App.css";

if (process.env.NODE_ENV === "production") {
  inject();
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (error.message === "401") {
        window.location.href = "/login";
      }
    },
  }),
});

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthContext>
          <TooltipProvider>
            <RouterProvider router={router} />
          </TooltipProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </AuthContext>
      </QueryClientProvider>
      <Toaster />
    </>
  );
}

export default App;
