import * as React from "react";
import { Meta, Story } from "@storybook/react";
import { Header as SystemHeader, HeaderContainerProps } from "./index";
import { Heading } from "../Heading";
import { styled } from "../stitches";
import { Menu, X } from "react-feather";

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

export const Header: Story<HeaderContainerProps> = (props) => (
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
          Icon={<Menu />}
        />
      }
      CloseTrigger={
        <SystemHeader.FullscreenMenu.Trigger
          label="Menü schließen"
          Icon={<X />}
        />
      }
    >
      <SystemHeader.FullscreenMenu.Content title="Menü">
        <MenuItems />
      </SystemHeader.FullscreenMenu.Content>
    </SystemHeader.FullscreenMenu.Container>
  </StyledHeaderContainer>
);
