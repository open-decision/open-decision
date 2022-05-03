import * as React from "react";
import { Icon as IconImpl, IconProps } from "@open-decision/design-system";

import { Meta, Story } from "@storybook/react";
import { Plus } from "react-feather";

export default {
  component: IconImpl,
  title: "Components/Icon",
} as Meta;

const IconTemplate: Story<IconProps> = (props) => (
  <IconImpl {...props}>
    <Plus />
  </IconImpl>
);

export const Icon = IconTemplate.bind({});
