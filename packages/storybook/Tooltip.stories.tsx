import * as React from "react";
import {
  Tooltip as SystemTooltip,
  TooltipRootProps,
  Button,
  Text,
} from "@open-decision/design-system";

import { Meta, Story } from "@storybook/react";

export default {
  component: SystemTooltip.Root,
  title: "Components/Tooltip",
} as Meta;

export const Tooltip: Story<TooltipRootProps> = (props) => (
  <SystemTooltip.Root defaultOpen={true} {...props}>
    <SystemTooltip.Trigger asChild>
      <Button>Hover and hold for Tooltip</Button>
    </SystemTooltip.Trigger>
    <SystemTooltip.Content sideOffset={5}>
      <Text>Test</Text>
      <SystemTooltip.Arrow />
    </SystemTooltip.Content>
  </SystemTooltip.Root>
);
