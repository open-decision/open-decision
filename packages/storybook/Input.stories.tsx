import * as React from "react";
import { Meta, Story } from "@storybook/react";
import {
  Button,
  Field,
  Form,
  Icon,
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
    onSubmit={(data) => console.log(data)}
    css={{ display: "grid", gap: "$2", width: "max-content" }}
  >
    <SystemInput {...props} name="1" />
    <Field label="Testinput">
      <SystemInput
        {...props}
        name="2"
        required={{ value: true, message: "This Input is required" }}
      />
    </Field>
    <Button>Submit</Button>
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
    <Button key="button" size="small" variant="tertiary">
      <Icon label="Remove Content">
        <ArrowRight />
      </Icon>
    </Button>,
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
    <Button key="button" size="small" variant="tertiary">
      <Icon label="Remove Content">
        <ArrowRight />
      </Icon>
    </Button>,
  ],
};
