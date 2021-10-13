import * as React from "react";
import { Meta, Story } from "@storybook/react";
import { Combobox } from "./index";
import { VariantProps } from "@stitches/react";
import { Form } from "../Form";
import { Input, InlineInput } from "../Inputs";

export default {
  component: Combobox,
  title: "Components/Inputs/Combobox",
} as Meta;

type Props = VariantProps<typeof Combobox>;

const items = [
  { id: "123", label: "test" },
  { id: "1234", label: "another one" },
  { id: "12345", label: "a third thingy" },
  { id: "12312", label: "last one" },
  { id: "3524523", label: "whatever" },
  { id: "34564356", label: "oho" },
];

const Template: Story<Props> = (props) => {
  return (
    <Form
      initialValues={{
        test: "123",
      }}
      onChange={({ values }) => console.log(values)}
      css={{ display: "grid", gap: "$2", width: "max-content" }}
    >
      <Combobox items={items} Input={<Input name="test" />} {...props} />
    </Form>
  );
};

export const Default = Template.bind({});
Default.args = { Input: <Input name="test" /> };

export const Inline = Template.bind({});
Inline.args = { Input: <InlineInput name="test" /> };
