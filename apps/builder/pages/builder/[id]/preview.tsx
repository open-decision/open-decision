import {
  buttonStyles,
  Icon,
  Link as SystemLink,
  Row,
  Tabs,
  ToggleGroup,
} from "@open-decision/design-system";
import * as React from "react";
import { BaseHeader, Layout } from "../../../components";
import { BuilderLayout } from "../../../features/Builder/components/BuilderLayout";
import { ProjectMenu } from "../../../features/Builder/components/ProjectMenu";
import { useTreeId } from "../../../features/Data/useTreeId";
import VorschauPageImpl from "../../../features/Preview/Preview";
import { DesktopIcon, MobileIcon, Pencil1Icon } from "@radix-ui/react-icons";
import Link from "next/link";
import Head from "next/head";
import { client } from "@open-decision/api-client";
import { safeFetch } from "@open-decision/api-helpers";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { treeQueryKey } from "../../../features/Data/useTreeAPI";

export const getServerSideProps: GetServerSideProps<
  any,
  { id: string }
> = async ({ req, params, locale }) => {
  const messages = await import(`@open-decision/translations`).then(
    (translations) => ({
      common: translations.de.common,
      builder: translations.de.builder,
    })
  );

  if (!params)
    return {
      redirect: {
        destination: "/",
      },
      props: {},
    };

  const OD = client({
    token: req.cookies["token"],
    urlPrefix: `${process.env.NEXT_PUBLIC_OD_API_ENDPOINT}/v1`,
    fetchFunction: safeFetch,
  });
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(treeQueryKey(params.id), () =>
    OD.trees.getSingle({ params: { uuid: params.id } })
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      messages,
      locale,
      now: new Date().toISOString(),
    },
  };
};
export default function VorschauPage() {
  const treeId = useTreeId();
  const [selectedTab, setSelectedTab] = React.useState("desktop");

  return treeId ? (
    <>
      <Head>
        <title>Open Decision Preview</title>
      </Head>
      <Tabs.Root defaultValue="desktop" asChild>
        <Layout
          css={{
            layer: "3",
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr 1fr",
            gridTemplateRows: "max-content 1fr",
            height: "100%",
          }}
        >
          <BaseHeader
            css={{ gridColumn: "1 / -1", gridRow: "1" }}
            LogoSlot={<ProjectMenu treeId={treeId} />}
          >
            <Row css={{ justifyContent: "center", flex: 1 }}>
              <Tabs.List>
                <ToggleGroup.Root
                  type="single"
                  defaultValue="desktop"
                  value={selectedTab}
                  onValueChange={(value) => {
                    if (value) setSelectedTab(value);
                  }}
                >
                  <ToggleGroup.Item value="desktop" asChild>
                    <Tabs.Trigger value="desktop" asChild>
                      <ToggleGroup.Button>
                        <Icon>
                          <DesktopIcon />
                        </Icon>
                        Desktop
                      </ToggleGroup.Button>
                    </Tabs.Trigger>
                  </ToggleGroup.Item>
                  <ToggleGroup.Item value="mobile" asChild>
                    <Tabs.Trigger value="mobile" asChild>
                      <ToggleGroup.Button>
                        <Icon>
                          <MobileIcon />
                        </Icon>
                        Mobil
                      </ToggleGroup.Button>
                    </Tabs.Trigger>
                  </ToggleGroup.Item>
                </ToggleGroup.Root>
              </Tabs.List>
            </Row>
            <Link passHref href={`/builder/${treeId}`}>
              <SystemLink
                className={buttonStyles({
                  variant: "secondary",
                  css: { textDecoration: "none !important" },
                })}
              >
                <Icon>
                  <Pencil1Icon />
                </Icon>
                Builder
              </SystemLink>
            </Link>
          </BaseHeader>
          <VorschauPageImpl />
        </Layout>
      </Tabs.Root>
    </>
  ) : null;
}

VorschauPage.getLayout = function getLayout(page: React.ReactElement) {
  return <BuilderLayout>{page}</BuilderLayout>;
};
