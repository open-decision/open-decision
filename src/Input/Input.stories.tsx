import * as React from "react";
import { Meta, Story } from "@storybook/react";
import { Input as SystemInput } from "./index";

export default {
  component: SystemInput,
  title: "Components/Inputs/Input",
} as Meta;

type Props = React.ComponentProps<typeof SystemInput>;

export const Input: Story<Props> = (props) => <SystemInput />;
