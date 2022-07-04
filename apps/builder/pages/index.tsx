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
import { TGetTreesOutput } from "@open-decision/tree-api-specification";

export const getServerSideProps: GetServerSideProps = async function ({
  req,
  res,
  query,
}) {
  const OD = client({ urlPrefix: `${process.env.OD_API_ENDPOINT}/v1` });

  try {
    const { data: authData, response } = await OD.auth.refreshToken(
      {},
      {
        headers: {
          Cookie: req.headers.cookie,
        },
      }
    );

    if (authData instanceof ODError) throw response;

    const authenticatedOD = client({
      token: authData.access.token,
      urlPrefix: `${process.env.OD_API_ENDPOINT}/v1`,
    });
    const { data: trees } = await authenticatedOD.trees.getCollection({});

    const setCookieHeader = response.headers.get("set-cookie");
    setCookieHeader ? res.setHeader("set-cookie", setCookieHeader) : null;
    return { props: { ...authData, trees } };
  } catch (error) {
    return {
      redirect: {
        destination: `/auth/login?from=/`,
        permanent: false,
      },
    };
  }
};

type PageProps = TLoginOutput & { trees: TGetTreesOutput };

export default function DashboardPage({ user, access, trees }: PageProps) {
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
            <TreeList trees={trees} />
          </React.Suspense>
        </Stack>
      </ErrorBoundary>
    </AuthProvider>
  );
}

DashboardPage.getLayout = getDashboardLayout;
