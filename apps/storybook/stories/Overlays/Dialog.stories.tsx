import * as React from "react";
import {
  Box,
  Button,
  Dialog as DialogPrimitive,
  DialogRootProps,
  Heading,
  Text,
} from "@open-decision/design-system";

import { Meta, Story } from "@storybook/react";

export default {
  component: DialogPrimitive.Root,
  parameters: {
    layout: "centered",
  },
} as Meta;

export const Dialog: Story<DialogRootProps> = (props) => (
  <DialogPrimitive.Root {...props}>
    <DialogPrimitive.Trigger asChild>
      <Button>Open Dialog</Button>
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
        <DialogPrimitive.ButtonRow
          isLoading={false}
          css={{ colorScheme: "danger" }}
        >
          Löschen
        </DialogPrimitive.ButtonRow>
      </Box>
    </DialogPrimitive.Content>
  </DialogPrimitive.Root>
);
