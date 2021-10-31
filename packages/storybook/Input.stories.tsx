import * as React from "react";
import { Meta, Story } from "@storybook/react";
import {
  Field,
  Form,
  Icon,
  IconButton,
  Input as SystemInput,
  InputProps,
} from "@open-legal-tech/design-system";
import { Search, ArrowRight } from "react-feather";

export default {
  component: SystemInput,
  title: "Components/Inputs/Input",
} as Meta;

const Input: Story<InputProps> = (props) => (
  <Form
    initialValues={{ test: "" }}
    onChange={({ values }) => console.log(values.test)}
    css={{ display: "grid", gap: "$2", width: "max-content" }}
  >
    <SystemInput {...props} name="test" />
    <Field label="Testinput">
      <SystemInput {...props} name="test" />
    </Field>
  </Form>
);

export const Default = Input.bind({});
export const WithIcon = Input.bind({});
WithIcon.args = {
  Icon: (
    <Icon label="Suche" alignByContent="left">
      <Search />
    </Icon>
  ),
};

export const WithButtons = Input.bind({});
WithButtons.args = {
  Buttons: [
    <IconButton
      key="button"
      size="small"
      variant="tertiary"
      label="Remove Content"
      Icon={<ArrowRight />}
    />,
  ],
};
export const WithButtonsAndIcons = Input.bind({});
WithButtonsAndIcons.args = {
  Icon: (
    <Icon label="Suche" alignByContent="left">
      <Search />
    </Icon>
  ),
  Buttons: [
    <IconButton
      key="button"
      size="small"
      variant="tertiary"
      label="Remove Content"
      Icon={<ArrowRight />}
    />,
  ],
};
