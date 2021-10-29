import * as React from "react";

import { Meta, Story } from "@storybook/react";
import { Heading, HeadingProps } from "./index";
import { Box } from "../Box";

export default {
  component: Heading,
  title: "Components/Heading",
  decorators: [(Component) => <Component />],
} as Meta;

export const List: Story<HeadingProps> = (props) => (
  <Box css={{ display: "grid", gap: "$4" }}>
    <Heading size="extra-large" {...props}>
      Headline XL
    </Heading>
    <Heading size="large" {...props}>
      Headline Large
    </Heading>
    <Heading {...props}>Headline Medium</Heading>
    <Heading size="small" {...props}>
      Headline Small
    </Heading>
    <Heading size="extra-small" {...props}>
      Headline ExtraSmall
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
