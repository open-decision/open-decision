import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Field } from "components";
import {
  styled,
  Button,
  Heading,
  Box,
  IconButton,
} from "@open-legal-tech/design-system";
import { useTreeStore } from "./hooks/useTrees";
import { Cross1Icon, PlusCircledIcon } from "@radix-ui/react-icons";

const Overlay = styled(Dialog.Overlay, {
  backgroundColor: "rgba(0, 0, 0, .15)",
  position: "fixed",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
});

const Content = styled(Dialog.Content, {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 200,
  maxWidth: "fit-content",
  maxHeight: "85vh",
  padding: "$6 $8",
  marginTop: "-5vh",
  backgroundColor: "white",
  borderRadius: 6,
  borderLeft: "4px solid",
  borderLeftColor: "$emerald500",

  "&:focus": {
    outline: "none",
  },
});

const Form = styled("form", {
  marginTop: "$6",
  display: "flex",
  flexDirection: "column",
});

const DialogButton = styled(Dialog.Trigger, {
  display: "flex",
  alignItems: "center",
});
export const NewTreeButton: React.FC = () => {
  const [name, setName] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const createTree = useTreeStore(
    React.useCallback((state) => state.createTree, [])
  );

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <DialogButton as={Button} variant="secondary" className="my-8" size="xl">
        <PlusCircledIcon className="w-6 h-6 mr-2 inline" />
        Neue Anwendung erstellen
      </DialogButton>
      <Overlay />
      <Content>
        {/* <Box
          css={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Heading css={{ marginRight: "$8" }}>Neuen Baum hinzufügen</Heading>
          <DialogButton
            variant="tertiary"
            label="Baumerstellung schließen"
            as={IconButton}
          >
            <Cross1Icon />
          </DialogButton>
        </Box> */}
        <Form
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            createTree({ name }, () => setOpen(false));
          }}
        >
          <Field
            label="Name"
            layout="inline"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Button
            variant="secondary"
            css={{ marginTop: "$6", alignSelf: "flex-end" }}
            type="submit"
          >
            Erstellen
          </Button>
        </Form>
      </Content>
    </Dialog.Root>
  );
};
