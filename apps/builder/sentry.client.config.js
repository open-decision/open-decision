// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import LogRocket from "logrocket";
import { BrowserTracing } from "@sentry/tracing";

const SENTRY_DSN =
  process.env.NODE_ENV === "production"
    ? (process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN) ??
      "https://ca79fcfbf1fa44f2bf0371ef3021181b@o1088372.ingest.sentry.io/6141840"
    : undefined;

Sentry.init({
  integrations: [new BrowserTracing()],
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
});

Sentry.configureScope((scope) => {
  scope.setExtra("sessionURL", LogRocket.sessionURL);
});
