import * as React from "react";

import { Meta, Story } from "@storybook/react";
import { Checkbox } from "./index";
import { Form } from "../Form";

export default {
  component: Checkbox.Field,
  title: "Components/Checkbox",
} as Meta;

const CheckboxTemplate: Story<React.ComponentProps<typeof Checkbox.Field>> = (
  props
) => (
  <Form
    onSubmit={({ values }) => alert(values)}
    initialValues={{ test: { box1: false, box2: false } }}
  >
    <Checkbox.Group name="test">
      <Checkbox.Field value="box1" label="Test" {...props} />
      <Checkbox.Field value="box2" label="A disabled one" disabled {...props} />
    </Checkbox.Group>
  </Form>
);

export const Field = CheckboxTemplate.bind({});
