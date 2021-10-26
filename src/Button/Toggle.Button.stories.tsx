import * as React from "react";

import { Meta } from "@storybook/react";

import { ToggleButton, ToggleGroup, ToggleButtonProps } from "./ToggleButton";
import { Users } from "react-feather";
import { Box } from "../Box";
import { StoryWithoutCSS } from "../../types/utils";
import { IconButton } from "./IconButton";
export default {
  component: ToggleButton,
  title: "Components/ToggleButton",
} as Meta;

const SingleToggleButtonTemplate: StoryWithoutCSS<ToggleButtonProps> = (
  props
) => (
  <Box css={{ display: "grid", gap: "$2", width: "max-content" }}>
    <ToggleButton {...props} />
    <ToggleButton variant="secondary" {...props} />
    <ToggleButton variant="tertiary" {...props} />
    <ToggleGroup.Root type="single">
      <ToggleGroup.Item value="left" {...props} />
      <ToggleGroup.Item value="middle" {...props} />
      <ToggleGroup.Item value="right" {...props} />
    </ToggleGroup.Root>
  </Box>
);

export const Default = SingleToggleButtonTemplate.bind({});
Default.args = {
  children: <IconButton label="" variant="secondary" Icon={<Users />} />,
};
