import * as React from "react";

import { Meta, Story } from "@storybook/react";
import { ContactButtons as SystemContactButtons } from "./index";

export default {
  component: SystemContactButtons.Container,
  title: "Components/ContactButtons",
} as Meta;

type Props = Omit<
  React.ComponentProps<typeof SystemContactButtons.Container>,
  "css"
>;

export const ContactButtons: Story<Props> = (props) => (
  <SystemContactButtons.Container {...props}>
    {SystemContactButtons.Buttons.map(({ link, Component }) => {
      return <a href={link}>{Component}</a>;
    })}
  </SystemContactButtons.Container>
);
