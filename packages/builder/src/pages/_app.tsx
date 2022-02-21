import * as React from "react";
import { Layout } from "components/Layout";
import type { AppProps } from "next/app";
import "../design/index.css";
import {
  Box,
  Button,
  globalStyles,
  Text,
} from "@open-legal-tech/design-system";
import { AuthProvider, useAuth } from "features/Auth/useAuth";
import { useRouter } from "next/router";
import { protectedRoutes } from "../config/protectedRoutes";

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  globalStyles();
  const router = useRouter();

  return (
    <AuthProvider router={router}>
      <Text
        css={{
          position: "absolute",
          bottom: 20,
          right: 20,
          zIndex: 9999,
          color: "$gray11",
        }}
      >
        Build ID: {process.env.NEXT_PUBLIC_APP_VERSION?.substring(0, 7)}
      </Text>
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

  return !state.matches("loggedIn") &&
    protectedRoutes.some((routeRegEx) => routeRegEx.test(pathname)) ? (
    <Box />
  ) : (
    children
  );
}
