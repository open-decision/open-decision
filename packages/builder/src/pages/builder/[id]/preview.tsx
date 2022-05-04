import {
  buttonStyles,
  Icon,
  Link as SystemLink,
  Row,
  Stack,
  Tabs,
  ToggleGroup,
} from "@open-decision/design-system";
import { BaseHeader, Layout } from "components";
import * as React from "react";
import Link from "next/link";
import { Preview } from "features/Preview/Preview";
import { InterpreterProvider } from "@open-decision/interpreter";
import { useGetTreeContentQuery } from "features/Data/generated/graphql";
import { Tree } from "@open-decision/type-classes";
import { DesktopIcon, MobileIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { ProjectMenu } from "features/Builder/components/ProjectMenu";
import { useTreeId } from "features/Data/useTreeId";
import { BuilderLayout } from "../../../features/Builder/components/BuilderLayout";

export default function VorschauPage() {
  const id = useTreeId();
  const [selectedTab, setSelectedTab] = React.useState("desktop");

  const { data } = useGetTreeContentQuery(
    { uuid: id },
    { staleTime: Infinity }
  );

  const parsedData = Tree.Type.safeParse(data?.decisionTree?.treeData);
  if (!parsedData.success) return null;
  const tree = parsedData.data;

  return (
    <InterpreterProvider tree={tree}>
      <BaseHeader
        css={{ gridColumn: "1 / -1", gridRow: "1" }}
        LogoSlot={<ProjectMenu />}
      >
        <Row css={{ justifyContent: "center", flex: 1 }}>
          <Tabs.List>
            <ToggleGroup.Root
              type="single"
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
            })}
          >
            <Icon>
              <Pencil1Icon />
            </Icon>
            Builder
          </SystemLink>
        </Link>
      </BaseHeader>

      <Tabs.Content value="desktop" asChild>
        <Preview
          css={{
            height: "100%",
            gridColumn: 2,
            paddingBlock: "$7",
          }}
        />
      </Tabs.Content>
      <Tabs.Content value="mobile" asChild>
        <Stack center css={{ gridColumn: 2 }}>
          <Preview
            css={{
              width: "400px",
              height: "700px",
              layer: "2",
              boxShadow: "$6",
              border: "2px solid $gray7",
              borderRadius: "$xl",
              $$padding: "$space$5",
            }}
          />
        </Stack>
      </Tabs.Content>
    </InterpreterProvider>
  );
}

VorschauPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <BuilderLayout>
      <Tabs.Root defaultValue="desktop" asChild>
        <Layout
          css={{
            layer: "3",
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr 1fr",
            gridTemplateRows: "max-content 1fr",
          }}
        >
          {page}
        </Layout>
      </Tabs.Root>
    </BuilderLayout>
  );
};
