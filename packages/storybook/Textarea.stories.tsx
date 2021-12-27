import * as React from "react";
import { Meta, Story } from "@storybook/react";
import { Field, Form, Textarea } from "@open-legal-tech/design-system";

export default {
  component: Textarea,
  title: "Components/Inputs/Textarea",
} as Meta;

export const Input: Story = (props) => (
  <Form
    onSubmit={({ values }) => alert(values)}
    css={{ display: "grid", gap: "$2", width: "max-content" }}
  >
    <Textarea {...props} name="test" />
    <Textarea {...props} name="another" disabled />
    <Field label="Testinput">
      <Textarea {...props} name="test2" size="large" rows={10} />
    </Field>
  </Form>
);
