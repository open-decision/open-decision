import * as React from "react";
import { Meta, Story } from "@storybook/react";
import { InputWithButton as SystemInputWithButton } from "./index";
import { Input } from "../index";
import { Button } from "../../Button";

export default {
  component: SystemInputWithButton,
  title: "Components/Inputs/InputWithButton",
} as Meta;

type Props = React.ComponentProps<typeof SystemInputWithButton>;

export const InputWithButton: Story<Props> = (props) => (
  <SystemInputWithButton
    {...props}
    Input={<Input />}
    Button={<Button>Senden</Button>}
  >
    Senden
  </SystemInputWithButton>
);
