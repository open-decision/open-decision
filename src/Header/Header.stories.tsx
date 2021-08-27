import * as React from "react";
import { Meta, Story } from "@storybook/react";
import { Header as SystemHeader } from "./index";
import { styled } from "@stitches/react";
import { Heading } from "../Heading";
import { Cross1Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";

const MenuItems = () => (
  <>
    <SystemHeader.Link>A Link</SystemHeader.Link>
    <SystemHeader.Link>Another Link</SystemHeader.Link>
    <SystemHeader.Link>Whatever Link</SystemHeader.Link>
    <SystemHeader.Link>Test Link</SystemHeader.Link>
    <SystemHeader.Link>Our most beloved Link</SystemHeader.Link>
    <SystemHeader.Link>I hate this Link</SystemHeader.Link>
  </>
);

export default {
  component: SystemHeader.Container,
  title: "Components/Header",
} as Meta;

const StyledHeaderContainer = styled(SystemHeader.Container, {
  "--bgColor": "$colors$primary3",
  backgroundColor: "var(--bgColor)",
  color: "$primary11",
});

type Props = React.ComponentProps<typeof SystemHeader.Container>;

export const Header: Story<Props> = (props) => (
  <StyledHeaderContainer {...props}>
    <SystemHeader.Content>
      <Heading size="xs" css={{ minWidth: "max-content", paddingBlock: "$3" }}>
        Open Legal Tech e.V.
      </Heading>
      <SystemHeader.ListMenu>
        <MenuItems />
      </SystemHeader.ListMenu>
    </SystemHeader.Content>
    <SystemHeader.FullscreenMenu.Container
      MenuTrigger={
        <SystemHeader.FullscreenMenu.Trigger
          label="Menü öffnen"
          Icon={<HamburgerMenuIcon />}
        />
      }
      CloseTrigger={
        <SystemHeader.FullscreenMenu.Trigger
          label="Menü schließen"
          Icon={<Cross1Icon />}
        />
      }
    >
      <SystemHeader.FullscreenMenu.Content title="Menü">
        <MenuItems />
      </SystemHeader.FullscreenMenu.Content>
    </SystemHeader.FullscreenMenu.Container>
  </StyledHeaderContainer>
);
