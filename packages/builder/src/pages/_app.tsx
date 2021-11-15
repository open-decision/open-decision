import { Layout } from "components/Layout";
import { QueryClient, QueryClientProvider } from "react-query";
import type { AppProps } from "next/app";
import "../design/index.css";
import { IdProvider } from "@radix-ui/react-id";
import { globalStyles } from "@open-legal-tech/design-system";
import { inspect } from "@xstate/inspect";
import { TreeProvider } from "features/Builder/state/useTree";

if (typeof window !== "undefined") {
  inspect({
    iframe: false,
  });
}

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  globalStyles();

  return (
    <QueryClientProvider client={queryClient}>
      <IdProvider>
        <TreeProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </TreeProvider>
      </IdProvider>
    </QueryClientProvider>
  );
}
