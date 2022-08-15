// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { BrowserTracing } from "@sentry/tracing";

const SENTRY_DSN =
  process.env.NODE_ENV === "production"
    ? process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN
    : undefined;

Sentry.init({
  integrations: [new BrowserTracing()],
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
});
