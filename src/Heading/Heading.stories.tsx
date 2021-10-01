import * as React from "react";

import { Meta, Story } from "@storybook/react";
import { Heading, HeadingProps } from "./index";
import { Box } from "../Box";
import { ClassNamesArg } from "@emotion/core";

export default {
  component: Heading,
  title: "Components/Heading",
  decorators: [(Component) => <Component />],
} as Meta;

export const List: Story<HeadingProps> = (props) => (
  <Box css={{ display: "grid", gap: "$4" }}>
    <Heading size="large" {...props}>
      Almost before we knew it, we had left the ground.
    </Heading>
    <Heading {...props}>
      Almost before we knew it, we had left the ground.
    </Heading>
    <Heading size="small" {...props}>
      Almost before we knew it, we had left the ground.
    </Heading>
    <Heading size="extra-small" {...props}>
      Almost before we knew it, we had left the ground.
    </Heading>
  </Box>
);

const Template: Story<HeadingProps> = (props) => (
  <Heading {...props}>Heading</Heading>
);

export const Large = Template.bind({});
Large.args = { size: "large" };

export const Medium = Template.bind({});

export const Small = Template.bind({});
Small.args = { size: "small" };

export const ExtraSmall = Template.bind({});
ExtraSmall.args = { size: "extra-small" };
