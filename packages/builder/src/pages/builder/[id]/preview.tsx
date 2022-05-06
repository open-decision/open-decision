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
import { DesktopIcon, MobileIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { ProjectMenu } from "features/Builder/components/ProjectMenu";
import { useTreeId } from "features/Data/useTreeId";
import { BuilderLayout } from "../../../features/Builder/components/BuilderLayout";
import { useNotificationStore } from "../../../features/Notifications/NotificationState";
import { useTreeContext } from "../../../features/Builder/state/treeStore/TreeContext";
import { useTreeSuspension } from "../../../features/Builder/state/treeStore/hooks/useTreeSuspension";

export default function VorschauPage() {
  return (
    <Tabs.Root defaultValue="desktop" asChild>
      <Layout
        css={{
          layer: "3",
          display: "grid",
          gridTemplateColumns: "1fr 1.5fr 1fr",
          gridTemplateRows: "max-content 1fr",
        }}
      >
        <VorschauPageImpl />
      </Layout>
    </Tabs.Root>
  );
}

function VorschauPageImpl() {
  const id = useTreeId();
  const [selectedTab, setSelectedTab] = React.useState("desktop");
  const {
    tree: { syncedStore },
  } = useTreeContext();
  const { addNotification } = useNotificationStore();

  return (
    <InterpreterProvider
      tree={syncedStore}
      onException={(error) =>
        addNotification({
          title: error.code,
          content: error.message,
          variant: "danger",
        })
      }
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
  return <BuilderLayout>{page}</BuilderLayout>;
};
