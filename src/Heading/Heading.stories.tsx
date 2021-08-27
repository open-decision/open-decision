import * as React from "react";

import { Meta, Story } from "@storybook/react";
import { Heading } from "./index";
import { Box } from "../Box";

export default {
  component: Heading,
  title: "Components/Heading",
  decorators: [(Component) => <Component />],
} as Meta;

type Props = React.ComponentProps<typeof Heading>;

export const List: Story<Props> = (props) => (
  <Box css={{ display: "grid", gap: "$12" }}>
    <Heading {...props} size="xl">
      Almost before we knew it, we had left the ground.
    </Heading>
    <Heading {...props}>
      Almost before we knew it, we had left the ground.
    </Heading>
    <Heading {...props} size="md">
      Almost before we knew it, we had left the ground.
    </Heading>
    <Heading {...props} size="sm">
      Almost before we knew it, we had left the ground.
    </Heading>
    <Heading {...props} size="xs">
      Almost before we knew it, we had left the ground.
    </Heading>
  </Box>
);

const Template: Story<Props> = (props) => <Heading {...props}>Heading</Heading>;

export const ExtraLarge = Template.bind({});
ExtraLarge.args = { size: "xl" };

export const Large = Template.bind({});

export const Medium = Template.bind({});
Medium.args = { size: "md" };

export const Small = Template.bind({});
Small.args = { size: "sm" };

export const ExtraSmall = Template.bind({});
ExtraSmall.args = { size: "xs" };
