import * as React from "react";

import { Meta, Story } from "@storybook/react";
import {
  Text as SystemText,
  TextProps,
  Box,
  Stack,
} from "@open-decision/design-system";

export default {
  component: SystemText,
  parameters: {
    layout: "centered",
  },
} as Meta;

export const Text: Story<TextProps> = (props) => (
  <Stack css={{ gap: "$4" }} center>
    <SystemText size="large" {...props}>
      Text large
    </SystemText>
    <SystemText {...props}>Text medium</SystemText>
    <SystemText size="small" {...props}>
      Text small
    </SystemText>
    <SystemText size="extra-small" {...props}>
      Text extra-small
    </SystemText>
  </Stack>
);
