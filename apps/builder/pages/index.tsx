import { LoadingSpinner, Stack } from "@open-decision/design-system";
import { ErrorBoundary } from "@sentry/nextjs";
import { BaseHeader } from "../components";
import { TreeList } from "../features/Dashboard/TreeList";
import * as React from "react";
import { ErrorCard } from "../components/Error/ErrorCard";
import { getDashboardLayout } from "../features/Dashboard/DashboardLayout";
import { GetServerSideProps } from "next";
import { AuthProvider } from "../features/Auth/useAuth";
import { TLoginOutput } from "@open-decision/auth-api-specification";
import { TGetTreesOutput } from "@open-decision/tree-api-specification";
import { checkAuthentication } from "../features/Auth/checkAuthentication";

export const getServerSideProps: GetServerSideProps = async function (context) {
  return checkAuthentication(context);
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
