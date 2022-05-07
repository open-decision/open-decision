import * as React from "react";

import { Meta, Story } from "@storybook/react";
import {
  Label as Systemlabel,
  LabelProps,
  Box,
} from "@open-decision/design-system";

export default {
  component: Systemlabel,
  parameters: {
    layout: "centered",
  },
} as Meta;

export const Label: Story<LabelProps> = (props) => (
  <Box css={{ display: "grid", gap: "$4" }}>
    <Systemlabel {...props}>Label medium</Systemlabel>
    <Systemlabel size="small" {...props}>
      Label small
    </Systemlabel>
  </Box>
);
