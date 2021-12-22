import * as React from "react";

import { Meta, Story } from "@storybook/react";
import { RadioButtons, Form } from "@open-legal-tech/design-system";

export default {
  component: RadioButtons.Field,
  title: "Components/RadioButtons",
} as Meta;

const CheckboxTemplate: Story<React.ComponentProps<typeof RadioButtons.Field>> =
  (props) => (
    <Form onSubmit={(data) => console.log(data)}>
      <RadioButtons.Group name="test">
        <RadioButtons.Field {...props} value="1" label="Test" />
        <RadioButtons.Field {...props} value="2" label="Another one" />
        <RadioButtons.Field
          {...props}
          value="3"
          label="A disabled one"
          disabled
        />
      </RadioButtons.Group>
    </Form>
  );

export const Field = CheckboxTemplate.bind({});
