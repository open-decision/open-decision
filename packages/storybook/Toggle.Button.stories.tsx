import * as React from "react";

import { Meta, Story } from "@storybook/react";
import {
  ToggleButton,
  ToggleButtonProps,
  ToggleGroup,
  Box,
  Icon,
  Button,
} from "@open-legal-tech/design-system";
import { Users } from "react-feather";

export default {
  component: ToggleButton,
  title: "Components/ToggleButton",
} as Meta;

const SingleToggleButtonTemplate: Story<ToggleButtonProps> = (props) => (
  <Box css={{ display: "grid", gap: "$2", width: "max-content" }}>
    <ToggleButton {...props} />
    <ToggleButton {...props} />
    <ToggleButton {...props} />
    <ToggleGroup.Root type="single">
      <ToggleGroup.Item {...props} value="left" />
      <ToggleGroup.Item {...props} value="middle" />
      <ToggleGroup.Item {...props} value="right" />
    </ToggleGroup.Root>
  </Box>
);

export const Default = SingleToggleButtonTemplate.bind({});
Default.args = {
  children: (
    <Button variant="secondary">
      <Icon>
        <Users />
      </Icon>
    </Button>
  ),
};
