import * as React from "react";

import { Meta, Story } from "@storybook/react";
import { Link, LinkProps } from "./index";

export default {
  component: Link,
  title: "Components/Link",
} as Meta;

const LinkGrid: Story<LinkProps> = (props) => (
  <Link href="#" {...props}>
    Badge
  </Link>
);

export const Primary = LinkGrid.bind({});
