import * as React from "react";

import { Meta, Story } from "@storybook/react";
import {
  Heading as Systemheading,
  HeadingProps,
  Box,
  Stack,
} from "@open-decision/design-system";

export default {
  component: Systemheading,
  parameters: {
    layout: "centered",
  },
} as Meta;

export const Heading: Story<HeadingProps> = (props) => (
  <Stack css={{ gap: "$4" }} center>
    <Systemheading size="extra-large" {...props}>
      Headline XL
    </Systemheading>
    <Systemheading size="large" {...props}>
      Headline Large
    </Systemheading>
    <Systemheading {...props}>Headline Medium</Systemheading>
    <Systemheading size="small" {...props}>
      Headline Small
    </Systemheading>
    <Systemheading size="extra-small" {...props}>
      Headline ExtraSmall
    </Systemheading>
  </Stack>
);
