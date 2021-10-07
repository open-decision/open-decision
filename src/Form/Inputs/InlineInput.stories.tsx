import * as React from "react";
import { Meta, Story } from "@storybook/react";
import { InlineInput, InlineInputProps } from "./InlineInput";
import { VariantProps } from "@stitches/react";
import { Form } from "../Form";
import { Icon, IconButton } from "../../IconButton";
import { X, Check, Edit2 } from "../../icons";

export default {
  component: InlineInput,
  title: "Components/Inputs/InlineInput",
} as Meta;

const Buttons = [
  <IconButton
    alignByContent="right"
    css={{ colorScheme: "error" }}
    Icon={<X />}
    size="small"
    variant="ghost"
    label="Editieren abrrechen"
  />,
  <IconButton
    alignByContent="right"
    css={{ colorScheme: "success" }}
    Icon={<Check />}
    size="small"
    variant="ghost"
    label="Änderungen speichern"
  />,
];

const Input: Story<Omit<InlineInputProps, "css">> = (props) => (
  <Form
    initialValues={{
      test: "",
    }}
    onSubmit={({ values }) => alert(values)}
    css={{ display: "grid", gap: "$2", width: "max-content" }}
  >
    <InlineInput name="test" {...props} />
  </Form>
);

export const Default = Input.bind({});
export const Borderless = Input.bind({});
Borderless.args = {
  borderless: true,
  Icon: (
    <Icon label="Editieren">
      <Edit2 />
    </Icon>
  ),
};

export const WithButtons = Input.bind({});
WithButtons.args = { Buttons };
