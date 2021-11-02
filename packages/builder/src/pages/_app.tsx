import { Layout } from "components/Layout";
import { QueryClient, QueryClientProvider } from "react-query";
import type { AppProps } from "next/app";
import "../index.css";
import { IdProvider } from "@radix-ui/react-id";
import { globalCss } from "@open-legal-tech/design-system";
import { opinionated } from "stitches-normalize-css";

const queryClient = new QueryClient();
const globalStyles = globalCss(...opinionated);

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  globalStyles();

  return (
    <QueryClientProvider client={queryClient}>
      <IdProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </IdProvider>
    </QueryClientProvider>
  );
}
