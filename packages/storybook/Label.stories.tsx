import * as React from "react";

import { Meta, Story } from "@storybook/react";
import { Label, LabelProps, Box } from "@open-legal-tech/design-system";

export default {
  component: Label,
  title: "Components/Label",
  decorators: [(Component) => <Component />],
} as Meta;

export const List: Story<LabelProps> = (props) => (
  <Box css={{ display: "grid", gap: "$4" }}>
    <Label {...props}>Label medium</Label>
    <Label size="small" {...props}>
      Label small
    </Label>
  </Box>
);
