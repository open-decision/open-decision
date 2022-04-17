import {
  Box,
  buttonStyles,
  Icon,
  Link as SystemLink,
  Row,
  Tabs,
  ToggleGroup,
} from "@open-decision/design-system";
import { BaseHeader, MainContent } from "components";
import * as React from "react";
import Link from "next/link";
import { Preview } from "features/Preview/Preview";
import { InterpreterProvider } from "@open-decision/interpreter";
import { MobilePreview } from "features/Preview/MobilePreview";
import { ErrorBoundary } from "@sentry/nextjs";
import { ErrorFallback } from "features/Error/ErrorFallback";
import { GetServerSideProps } from "next";
import { useGetTreeContentQuery } from "features/Data/generated/graphql";
import { Tree } from "@open-decision/type-classes";
import { DesktopIcon, MobileIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { ProjectMenu } from "features/Builder/components/ProjectMenu";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: { id: context.params?.id },
  };
};

type Props = { id: string };

export default function VorschauPage({ id }: Props) {
  const { data } = useGetTreeContentQuery(
    { uuid: id },
    { staleTime: Infinity }
  );

  const parsedData = Tree.Type.safeParse(data?.decisionTree?.treeData);
  if (!parsedData.success) return null;
  const tree = parsedData.data;

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={ErrorFallback}>
        <InterpreterProvider tree={tree}>
          <Tabs.Root asChild defaultValue="desktop_preview">
            <MainContent
              css={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gridTemplateRows: "max-content 1fr",
              }}
            >
              <BaseHeader LogoSlot={<ProjectMenu />}>
                <Row css={{ justifyContent: "center", flex: 1 }}>
                  <ToggleGroup.Root type="single" defaultValue="desktop">
                    <ToggleGroup.Item value="desktop">
                      <Icon>
                        <DesktopIcon />
                      </Icon>
                      Desktop
                    </ToggleGroup.Item>
                    <ToggleGroup.Item value="mobile">
                      <Icon>
                        <MobileIcon />
                      </Icon>
                      Mobil
                    </ToggleGroup.Item>
                  </ToggleGroup.Root>
                </Row>
                <Link passHref href={`/builder/${id}`}>
                  <SystemLink
                    className={buttonStyles({
                      variant: "secondary",
                    })}
                    underline={false}
                  >
                    <Icon>
                      <Pencil1Icon />
                    </Icon>
                    Builder
                  </SystemLink>
                </Link>
              </BaseHeader>
              <Box
                css={{
                  position: "relative",
                  width: "100vw",
                }}
              >
                <Tabs.Content value="desktop_preview" css={{ height: "100%" }}>
                  <Preview tree={tree} />
                </Tabs.Content>
                <Tabs.Content
                  value="mobile_preview"
                  css={{ backgroundColor: "$gray6", height: "100%" }}
                >
                  <MobilePreview />
                </Tabs.Content>
              </Box>
            </MainContent>
          </Tabs.Root>
        </InterpreterProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
}
