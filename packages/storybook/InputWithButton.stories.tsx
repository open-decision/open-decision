import * as React from "react";
import { Meta, Story } from "@storybook/react";
import {
  Button,
  Form,
  Icon,
  Input,
  InputWithButton as SystemInputWithButton,
  InputWithButtonProps,
} from "@open-legal-tech/design-system";
import { Search } from "react-feather";

export default {
  component: SystemInputWithButton,
  title: "Components/Inputs/InputWithButton",
} as Meta;

const InputWithButton: Story<InputWithButtonProps> = (props) => (
  <Form onSubmit={({ values }) => alert(values)} initialValues={{ test: "" }}>
    <SystemInputWithButton {...props}>Senden</SystemInputWithButton>
  </Form>
);

export const Default = InputWithButton.bind({});
Default.args = {
  Input: <Input name="test" />,
  Button: <Button>Senden</Button>,
};
export const WithIcon = InputWithButton.bind({});
WithIcon.args = {
  Input: (
    <Input
      name="test"
      Icon={
        <Icon label="Suche" alignByContent="left">
          <Search />
        </Icon>
      }
    />
  ),
  Button: <Button>Senden</Button>,
};
