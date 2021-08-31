import * as React from "react";
import { Meta, Story } from "@storybook/react";
import { InputWithButton as SystemInputWithButton } from "./index";
import { Input, InputWithButtonProps } from "../index";
import { Button } from "../../Button";

export default {
  component: SystemInputWithButton,
  title: "Components/Inputs/InputWithButton",
} as Meta;

export const InputWithButton: Story<InputWithButtonProps> = (props) => (
  <SystemInputWithButton
    {...props}
    Input={<Input />}
    Button={<Button>Senden</Button>}
  >
    Senden
  </SystemInputWithButton>
);
