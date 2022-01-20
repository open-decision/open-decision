import * as React from "react";
import { Layout } from "components/Layout";
import { QueryClient, QueryClientProvider } from "react-query";
import type { AppProps } from "next/app";
import "../design/index.css";
import { Box, globalStyles } from "@open-legal-tech/design-system";
import { TreeProvider } from "features/Builder/state/useTree";
import { AuthProvider, useAuth } from "features/Auth/useAuth";
import { useRouter } from "next/router";
import { protectedRoutes } from "../config/protectedRoutes";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  globalStyles();
  const router = useRouter();

  return (
    <AuthProvider router={router}>
      <QueryClientProvider client={queryClient}>
        <TreeProvider>
          <Layout>
            <ProtectedRoute>
              <Component {...pageProps} />
            </ProtectedRoute>
          </Layout>
        </TreeProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

function ProtectedRoute({ children }) {
  const [state] = useAuth();
  const { pathname } = useRouter();

  return !state.matches("loggedIn") && protectedRoutes.includes(pathname) ? (
    <Box />
  ) : (
    children
  );
}
