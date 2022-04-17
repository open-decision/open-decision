import * as React from "react";
import { Layout } from "components/Layout";
import type { AppProps } from "next/app";
import "../design/index.css";
import { Box, globalStyles, Tooltip } from "@open-decision/design-system";
import { AuthProvider, useAuth } from "features/Auth/useAuth";
import { useRouter } from "next/router";
import { protectedRoutes } from "../config/protectedRoutes";
import { ReactQueryDevtools } from "react-query/devtools";
import { queryClient } from "features/Data/queryClient";
import { QueryClientProvider } from "react-query";

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  globalStyles();
  const router = useRouter();

  return (
    <AuthProvider router={router}>
      <QueryClientProvider client={queryClient}>
        <Tooltip.Provider delayDuration={50}>
          <Layout>
            <ProtectedRoute>
              <Component {...pageProps} />
            </ProtectedRoute>
          </Layout>
        </Tooltip.Provider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </AuthProvider>
  );
}

function ProtectedRoute({ children }) {
  const [state] = useAuth();
  const { pathname } = useRouter();

  if (
    (!state.matches("loggedIn") &&
      protectedRoutes.some((routeRegEx) => routeRegEx.test(pathname))) ||
    state.matches("undetermined")
  )
    return <Box />;

  return children;
}
