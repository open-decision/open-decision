import * as React from "react";
import { Meta, Story } from "@storybook/react";
import { InputWithButton as SystemInputWithButton } from "./index";
import { Input } from "../Input";
import { Button } from "../../../Button";
import { Form } from "../../Form";

export default {
  component: SystemInputWithButton,
  title: "Components/Inputs/InputWithButton",
} as Meta;

export const InputWithButton: Story<
  React.ComponentProps<typeof SystemInputWithButton>
> = (props) => (
  <Form onSubmit={({ values }) => alert(values)} initialValues={{ test: "" }}>
    <SystemInputWithButton
      css={{ $radius: "$radii$md" }}
      {...props}
      Input={<Input name="test" />}
      Button={<Button>Senden</Button>}
    >
      Senden
    </SystemInputWithButton>
  </Form>
);
