import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogRootProps,
  Heading,
  Text,
} from "@open-legal-tech/design-system";

import { Meta, Story } from "@storybook/react";

export default {
  component: Dialog.Root,
  title: "Components/Dialog",
} as Meta;

export const DialogTemplate: Story<DialogRootProps> = (props) => (
  <Dialog.Root {...props}>
    <Dialog.Trigger asChild>
      <Button>Open Dialog</Button>
    </Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Title asChild>
        <Heading css={{ marginBottom: "$3" }} size="extra-small">
          Sind sie absolut sicher?
        </Heading>
      </Dialog.Title>
      <Dialog.Description asChild>
        <Text css={{ marginBottom: "$6", color: "$gray11" }}>
          Diese Aktion kann nicht rückgängig gemacht werden.
          <br />
          Trotzdem löschen?
        </Text>
      </Dialog.Description>
      <Box css={{ display: "flex", gap: "$4", justifyContent: "end" }}>
        <Dialog.Close asChild>
          <Button size="small" variant="secondary">
            Abbrechen
          </Button>
        </Dialog.Close>
        <Dialog.Close asChild>
          <Button
            size="small"
            variant="secondary"
            css={{ colorScheme: "error" }}
          >
            Löschen
          </Button>
        </Dialog.Close>
      </Box>
    </Dialog.Content>
  </Dialog.Root>
);
