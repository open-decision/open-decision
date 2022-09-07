import * as Sentry from "@sentry/nextjs";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  integrations: [
    new BrowserTracing({
      tracingOrigins: ["api.open-decision.org", "localhost"],
    }),
  ],
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
