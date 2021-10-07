import * as React from "react";
import { Meta, Story } from "@storybook/react";
import { InputWithButton as SystemInputWithButton } from "./index";
import { Input } from "./Input";
import { Button } from "../../Button";
import { Form } from "../Form";
import { Icon } from "../../IconButton";
import { Search } from "../../icons";

export default {
  component: SystemInputWithButton,
  title: "Components/Inputs/InputWithButton",
} as Meta;

const InputWithButton: Story<
  React.ComponentProps<typeof SystemInputWithButton>
> = (props) => (
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
