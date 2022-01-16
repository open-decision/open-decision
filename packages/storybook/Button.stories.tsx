import * as React from "react";

import { Meta, Story } from "@storybook/react";
import {
  Box,
  Button,
  ButtonProps,
  Heading,
  Icon,
} from "@open-legal-tech/design-system";
import { Plus } from "react-feather";

export default {
  component: Button,
  title: "Components/Button",
} as Meta;

const ButtonGrid: Story<Omit<ButtonProps, "css">> = (props) => (
  <Box css={{ display: "grid", gap: "$2", width: "max-content" }}>
    <Heading size="extra-small">Extra Small</Heading>
    <Box css={{ display: "flex", gap: "$4" }}>
      <Button size="extra-small" {...props} />
      <Button size="extra-small" square {...props}>
        <Icon size="extra-small">
          <Plus />
        </Icon>
      </Button>
      <Button size="extra-small" square round {...props}>
        <Icon size="extra-small">
          <Plus />
        </Icon>
      </Button>
      <Button size="extra-small" {...props}>
        <Icon size="extra-small">
          <Plus />
        </Icon>{" "}
        Button
      </Button>
    </Box>
    <Heading size="extra-small">Small</Heading>
    <Box css={{ display: "flex", gap: "$4" }}>
      <Button size="small" {...props} />
      <Button size="small" square {...props}>
        <Icon size="small">
          <Plus />
        </Icon>
      </Button>
      <Button size="small" square round {...props}>
        <Icon size="small">
          <Plus />
        </Icon>
      </Button>
      <Button size="small" {...props}>
        <Icon size="small">
          <Plus />
        </Icon>{" "}
        Button
      </Button>
    </Box>
    <Heading size="extra-small">Medium</Heading>
    <Box css={{ display: "flex", gap: "$4" }}>
      <Button {...props} />
      <Button square {...props}>
        <Icon>
          <Plus />
        </Icon>
      </Button>
      <Button square round {...props}>
        <Icon>
          <Plus />
        </Icon>
      </Button>
      <Button {...props}>
        <Icon>
          <Plus />
        </Icon>{" "}
        Button
      </Button>
    </Box>
    <Heading size="extra-small">Large</Heading>
    <Box css={{ display: "flex", gap: "$4" }}>
      <Button size="large" {...props} />
      <Button size="large" square {...props}>
        <Icon size="large">
          <Plus />
        </Icon>
      </Button>
      <Button size="large" square round {...props}>
        <Icon size="large">
          <Plus />
        </Icon>
      </Button>
      <Button size="large" {...props}>
        <Icon size="large">
          <Plus />
        </Icon>{" "}
        Button
      </Button>
    </Box>
  </Box>
);

export const Primary = ButtonGrid.bind({});
Primary.args = { children: "Button" };

export const Secondary = ButtonGrid.bind({});
Secondary.args = {
  variant: "secondary",
  children: "Button",
};

export const Tertiary = ButtonGrid.bind({});
Tertiary.args = { variant: "tertiary", children: "Button" };
export const Ghost = ButtonGrid.bind({});
Ghost.args = { variant: "ghost", children: "Button" };
