import * as React from "react";
import { Meta, Story } from "@storybook/react";
import {
  Button,
  Field,
  Input,
  InputWithButton as SystemInputWithButton,
  InputWithButtonProps,
} from "@open-decision/design-system";

export default {
  component: SystemInputWithButton,
  parameters: {
    layout: "centered",
  },
} as Meta;

export const InputWithButton: Story<InputWithButtonProps> = () => {
  return (
    <Field label="email" name="test">
      <SystemInputWithButton
        Input={<Input />}
        Button={<Button>Senden</Button>}
      />
    </Field>
  );
};
