import * as React from "react";

import { Meta, Story } from "@storybook/react";
import { RadioButtons } from "./index";
import { Form } from "../Form";

export default {
  component: RadioButtons.Field,
  title: "Components/RadioButtons",
} as Meta;

const CheckboxTemplate: Story<
  React.ComponentProps<typeof RadioButtons.Field>
> = (props) => (
  <Form onSubmit={({ values }) => alert(values)} initialValues={{ test: "1" }}>
    <RadioButtons.Group name="test">
      <RadioButtons.Field value="1" label="Test" {...props} />
      <RadioButtons.Field value="2" label="Another one" {...props} />
      <RadioButtons.Field
        value="3"
        label="A disabled one"
        disabled
        {...props}
      />
    </RadioButtons.Group>
  </Form>
);

export const Field = CheckboxTemplate.bind({});
