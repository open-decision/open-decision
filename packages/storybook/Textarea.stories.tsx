import * as React from "react";
import { Meta, Story } from "@storybook/react";
import { Field, useForm, Textarea, Button } from "@open-decision/design-system";

export default {
  component: Textarea,
  title: "Components/Inputs/Textarea",
} as Meta;

export const Input: Story = (props) => {
  const [Form, { register }] = useForm();

  return (
    <Form
      onSubmit={(data) => console.log(data)}
      css={{ display: "grid", gap: "$2", width: "max-content" }}
    >
      <Textarea {...props} {...register("test")} />
      <Textarea {...props} {...register("another", { disabled: true })} />
      <Field label="Testinput">
        <Textarea {...props} {...register("test2")} size="large" rows={10} />
      </Field>
      <Button type="submit">Submit</Button>
    </Form>
  );
};
