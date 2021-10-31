import * as React from "react";

import { Meta, Story } from "@storybook/react";
import {
  ContactButtons as SystemContactButtons,
  ContactButtonsContainerProps,
} from "@open-legal-tech/design-system";

export default {
  component: SystemContactButtons.Container,
  title: "Components/ContactButtons",
} as Meta;

export const ContactButtons: Story<ContactButtonsContainerProps> = (props) => (
  <SystemContactButtons.Container {...props}>
    {SystemContactButtons.Buttons.map((Component) => {
      return Component;
    })}
  </SystemContactButtons.Container>
);
