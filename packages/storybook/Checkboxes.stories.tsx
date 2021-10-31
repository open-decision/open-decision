import * as React from "react";

import { Meta, Story } from "@storybook/react";
import { Checkbox, Form, CheckboxFieldProps } from "@open-legal-tech/design-system";
export default {
  component: Checkbox.Field,
  title: "Components/Checkbox",
} as Meta;

const CheckboxTemplate: Story<CheckboxFieldProps> = (
  props
) => (
  <Form
    onSubmit={({ values }) => alert(values)}
    initialValues={{ test: { box1: false, box2: false } }}
  >
    <Checkbox.Group name="test">
      <Checkbox.Field {...props} value="box1" label="Test" />
      <Checkbox.Field {...props} value="box2" label="A disabled one" disabled />
    </Checkbox.Group>
  </Form>
);

export const Field = CheckboxTemplate.bind({});
