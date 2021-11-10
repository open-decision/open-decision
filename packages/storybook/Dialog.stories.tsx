import * as React from "react";
import {
  Box,
  Button,
  Dialog as DialogPrimitive,
  DialogRootProps,
  Heading,
  Text,
} from "@open-legal-tech/design-system";

import { Meta, Story } from "@storybook/react";

export default {
  component: DialogPrimitive.Root,
  title: "Components/Dialog",
} as Meta;

export const Dialog: Story<DialogRootProps> = (props) => (
  <DialogPrimitive.Root {...props}>
    <DialogPrimitive.Trigger asChild>
      <Button>Open DialogPrimitive</Button>
    </DialogPrimitive.Trigger>
    <DialogPrimitive.Content>
      <DialogPrimitive.Title asChild>
        <Heading css={{ marginBottom: "$3" }} size="extra-small">
          Sind sie absolut sicher?
        </Heading>
      </DialogPrimitive.Title>
      <DialogPrimitive.Description asChild>
        <Text css={{ marginBottom: "$6", color: "$gray11" }}>
          Diese Aktion kann nicht rückgängig gemacht werden.
          <br />
          Trotzdem löschen?
        </Text>
      </DialogPrimitive.Description>
      <Box css={{ display: "flex", gap: "$4", justifyContent: "end" }}>
        <DialogPrimitive.Close asChild>
          <Button size="small" variant="secondary">
            Abbrechen
          </Button>
        </DialogPrimitive.Close>
        <DialogPrimitive.Close asChild>
          <Button
            size="small"
            variant="secondary"
            css={{ colorScheme: "error" }}
          >
            Löschen
          </Button>
        </DialogPrimitive.Close>
      </Box>
    </DialogPrimitive.Content>
  </DialogPrimitive.Root>
);
