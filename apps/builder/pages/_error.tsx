/* eslint-disable @typescript-eslint/no-explicit-any */
import NextErrorComponent, { ErrorProps } from "next/error";
import * as Sentry from "@sentry/nextjs";
import { NextPage } from "next";
import { FullPageErrorFallback } from "../components/Error/FullPageErrorFallback";
import { convertToODError } from "@open-decision/type-classes";
import { NextIntlProvider } from "next-intl";

interface AppErrorProps extends ErrorProps {
  err?: Error;
  hasGetInitialPropsRun?: boolean;
  locale: string;
  messages: any;
  now: string;
}

const MyError: NextPage<AppErrorProps> = ({
  hasGetInitialPropsRun,
  err,
  locale,
  messages,
  now,
}) => {
  if (!hasGetInitialPropsRun && err) {
    // getInitialProps is not called in case of
    // https://github.com/vercel/next.js/issues/8592. As a workaround, we pass
    // err via _app.js so it can be captured
    Sentry.captureException(err);
    // Flushing is not required in this case as it only happens on the client
  }

  return (
    <NextIntlProvider now={new Date(now)} locale={locale} messages={messages}>
      <FullPageErrorFallback error={convertToODError(err)} />
    </NextIntlProvider>
  );
};

MyError.getInitialProps = async (context) => {
  const errorInitialProps = await NextErrorComponent.getInitialProps(context);
  const messages = await import(`@open-decision/translations`).then(
    (translations) => ({
      common: translations.de.common,
    })
  );

  const { res, err, asPath } = context;
  const localeData = {
    messages,
    locale: context.locale ?? "de",
    now: new Date().toISOString(),
  };

  // Workaround for https://github.com/vercel/next.js/issues/8592, mark when
  // getInitialProps has run
  //@ts-expect-error - This comes from the sentry auto setup. I assume it is correct.
  errorInitialProps.hasGetInitialPropsRun = true;

  // Returning early because we don't want to log 404 errors to Sentry.
  if (res?.statusCode === 404) {
    return { ...localeData, ...errorInitialProps };
  }

  // Running on the server, the response object (`res`) is available.
  //
  // Next.js will pass an err on the server if a page's data fetching methods
  // threw or returned a Promise that rejected
  //
  // Running on the client (browser), Next.js will provide an err if:
  //
  //  - a page's `getInitialProps` threw or returned a Promise that rejected
  //  - an exception was thrown somewhere in the React lifecycle (render,
  //    componentDidMount, etc) that was caught by Next.js's React Error
  //    Boundary. Read more about what types of exceptions are caught by Error
  //    Boundaries: https://reactjs.org/docs/error-boundaries.html

  if (err) {
    Sentry.captureException(err);

    // Flushing before returning is necessary if deploying to Vercel, see
    // https://vercel.com/docs/platform/limits#streaming-responses
    await Sentry.flush(2000);

    return { ...localeData, ...errorInitialProps };
  }

  // If this point is reached, getInitialProps was called without any
  // information about what the error might be. This is unexpected and may
  // indicate a bug introduced in Next.js, so record it in Sentry
  Sentry.captureException(
    new Error(`_error.js getInitialProps missing data at path: ${asPath}`)
  );
  await Sentry.flush(2000);

  return { ...localeData, ...errorInitialProps };
};

export default MyError;
