import * as React from "react";
import { Layout } from "components/Layout";
import type { AppProps } from "next/app";
import "../design/index.css";
import { Box, globalStyles } from "@open-legal-tech/design-system";
import { AuthProvider, useAuth } from "features/Auth/useAuth";
import { useRouter } from "next/router";
import { protectedRoutes } from "../config/protectedRoutes";
import "@fontsource/poppins";

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  globalStyles();
  const router = useRouter();

  return (
    <AuthProvider router={router}>
      <Layout>
        <ProtectedRoute>
          <Component {...pageProps} />
        </ProtectedRoute>
      </Layout>
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
