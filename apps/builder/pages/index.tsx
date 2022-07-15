import { LoadingSpinner, Stack } from "@open-decision/design-system";
import { ErrorBoundary } from "@sentry/nextjs";
import { BaseHeader } from "../components";
import { TreeList } from "../features/Dashboard/TreeList";
import * as React from "react";
import { ErrorCard } from "../components/Error/ErrorCard";
import { getDashboardLayout } from "../features/Dashboard/DashboardLayout";
import { GetServerSideProps } from "next";
import { client } from "@open-decision/api-client";
import { ODError } from "@open-decision/type-classes";
import { AuthProvider } from "../features/Auth/useAuth";
import { TLoginOutput } from "@open-decision/auth-api-specification";

export const getServerSideProps: GetServerSideProps = async function ({
  req,
  res,
}) {
  const OD = client({ urlPrefix: process.env.NEXT_PUBLIC_OD_API_ENDPOINT });

  try {
    const { data, response } = await OD.auth.refreshToken(
      {},
      {
        headers: {
          Cookie: req.headers.cookie,
        },
      }
    );

    if (data instanceof ODError) throw response;

    const setCookieHeader = response.headers.get("set-cookie");
    setCookieHeader ? res.setHeader("set-cookie", setCookieHeader) : null;
    return { props: data };
  } catch (error) {
    return { redirect: { destination: "/auth/login/", permanent: false } };
  }
};

type PageProps = TLoginOutput;

export default function DashboardPage({ user, access }: PageProps) {
  return (
    <AuthProvider initial="loggedIn" user={user} access={access}>
      <BaseHeader css={{ gridColumn: "1 / -1" }} />
      <ErrorBoundary
        fallback={
          <Stack center css={{ gridColumn: "2 / 4", gridRow: "2 / 4" }}>
            <ErrorCard title="Beim laden ihrer Bäume ist ein Fehler aufgetreten." />
          </Stack>
        }
      >
        <Stack
          css={{
            gridColumn: "2 / 4",
            gridRow: "2 / 4",
          }}
        >
          <React.Suspense
            fallback={
              <LoadingSpinner
                size="50px"
                css={{ flex: 1, alignSelf: "center" }}
              />
            }
          >
            <TreeList />
          </React.Suspense>
        </Stack>
      </ErrorBoundary>
    </AuthProvider>
  );
}

DashboardPage.getLayout = getDashboardLayout;
