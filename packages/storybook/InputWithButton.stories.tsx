import * as React from "react";
import { Meta, Story } from "@storybook/react";
import {
  Button,
  emailRegex,
  Field,
  Icon,
  Input,
  InputWithButton as SystemInputWithButton,
  InputWithButtonProps,
  useForm,
} from "@open-decision/design-system";

export default {
  component: SystemInputWithButton,
  title: "Components/Inputs/InputWithButton",
} as Meta;

const InputWithButton: Story<InputWithButtonProps> = () => {
  const [Form, { register }] = useForm({ defaultValues: { test: "" } });

  return (
    <Form onSubmit={(data) => console.log(data)}>
      <Field label="email" name="test">
        <SystemInputWithButton
          Input={
            <Input
              {...register("test", {
                pattern: { value: emailRegex, message: "Not a valid email." },
              })}
            />
          }
          Button={<Button>Senden</Button>}
        />
      </Field>
    </Form>
  );
};

export const Default = InputWithButton.bind({});
