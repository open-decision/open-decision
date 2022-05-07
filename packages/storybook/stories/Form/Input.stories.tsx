import * as React from "react";
import { Meta, Story } from "@storybook/react";
import {
  Field,
  Icon,
  Input as SystemInput,
  InputProps,
} from "@open-decision/design-system";
import { Search } from "react-feather";

export default {
  component: SystemInput,
  parameters: {
    layout: "centered",
  },
} as Meta;

const Input: Story<InputProps> = (props) => {
  return (
    <Field label="Testinput">
      <SystemInput css={{ layer: "4" }} {...props} />
    </Field>
  );
};

export const Default = Input.bind({});
export const WithIcon = Input.bind({});
WithIcon.args = {
  Icon: (
    <Icon label="Suche">
      <Search />
    </Icon>
  ),
};
