import * as React from "react";

import { Meta, Story } from "@storybook/react";
import { Button } from "./index";

export default {
  component: Button,
  title: "Components/Button",
} as Meta;

type Props = React.ComponentProps<typeof Button>;

const ButtonGrid: Story<Props> = (props) => <Button {...props} />;

export const Primary = ButtonGrid.bind({});
Primary.args = { children: "Button" };

export const Secondary = ButtonGrid.bind({});
Secondary.args = {
  variant: "secondary",
  children: "Button",
};

export const Tertiary = ButtonGrid.bind({});
Tertiary.args = { variant: "tertiary", children: "Button" };
