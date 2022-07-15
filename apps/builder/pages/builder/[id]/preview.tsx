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

export default function VorschauPage() {
  const id = useTreeId();
  const [selectedTab, setSelectedTab] = React.useState("desktop");

  return (
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
          LogoSlot={<ProjectMenu />}
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
          <Link passHref href={`/builder/${id}`}>
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
  );
}

VorschauPage.getLayout = function getLayout(page: React.ReactElement) {
  return <BuilderLayout>{page}</BuilderLayout>;
};
