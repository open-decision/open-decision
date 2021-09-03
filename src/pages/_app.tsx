import { Layout } from "components/Layout";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import type { AppProps } from "next/app";
import "../index.css";
import { IdProvider } from "@radix-ui/react-id";
import { inspect } from "@xstate/inspect";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  if (typeof window !== "undefined") {
    inspect({
      url: "https://statecharts.io/inspect",
      iframe: false,
    });
  }

  return (
    <QueryClientProvider client={queryClient}>
      <IdProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <ReactQueryDevtools />
      </IdProvider>
    </QueryClientProvider>
  );
}
