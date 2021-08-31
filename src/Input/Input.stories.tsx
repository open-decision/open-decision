import * as React from "react";
import { Meta, Story } from "@storybook/react";
import { Input as SystemInput } from "./index";
import { VariantProps } from "@stitches/react";

export default {
  component: SystemInput,
  title: "Components/Inputs/Input",
} as Meta;

type Props = VariantProps<typeof SystemInput>;

export const Input: Story<Props> = (props) => <SystemInput />;
