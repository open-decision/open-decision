import * as React from "react";
import { Meta, Story } from "@storybook/react";
import {
  InlineInput,
  InlineInputProps,
  useForm,
} from "@open-legal-tech/design-system";

export default {
  component: InlineInput,
  title: "Components/Inputs/InlineInput",
} as Meta;

const Input: Story<InlineInputProps> = (props) => {
  const [Form, { register }] = useForm();

  return (
    <Form
      onSubmit={(data) => console.log(data)}
      css={{ display: "grid", gap: "$2" }}
    >
      <InlineInput {...props} {...register("test")} />
    </Form>
  );
};

export const Default = Input.bind({});
