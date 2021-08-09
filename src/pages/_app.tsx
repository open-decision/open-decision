import { Layout } from "components";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import type { AppProps } from "next/app";
import "../index.css";
import { IdProvider } from "@radix-ui/react-id";
import { defaultTheme } from "design/stitches.config";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <IdProvider>
        <Layout>
          <Component {...pageProps} className={defaultTheme} />
        </Layout>
        <ReactQueryDevtools />
      </IdProvider>
    </QueryClientProvider>
  );
}
