import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { PlusCircleOutline, XOutline } from "@graywolfai/react-heroicons";
import { useQueryClient } from "react-query";
import { useCreate_TreeMutation } from "internalTypes";
import { Button, Field } from "components";
import { styled } from "utils/stitches.config";
import { useService } from "@xstate/react";
import { authService } from "features/Data/authStateMachine";

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

const CloseIcon = styled(Dialog.Close, {
  width: 26,
  height: 26,
  color: "$warmGray800",
  position: "absolute",
  right: 14,
  top: 14,
});

const Form = styled("form", {
  marginTop: "$6",
  display: "flex",
  flexDirection: "column",
});

const Heading = styled("h2", {
  fontSize: "$lg",
  fontWeight: "$semibold",
  color: "$gray600",
});

export const NewTreeButton: React.FC = () => {
  const [name, setName] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const queryClient = useQueryClient();
  const [state] = useService(authService);
  const createTreeMutation = useCreate_TreeMutation(state.context.client, {
    onSuccess: () => {
      queryClient.invalidateQueries("ALL_TREES");
      setOpen(false);
    },
  });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger as={Button} outlined className="my-8" size="xLarge">
        <PlusCircleOutline className="w-8 mr-2 inline" />
        Neue Anwendung erstellen
      </Dialog.Trigger>
      <Overlay />
      <Content>
        <CloseIcon>
          <XOutline />
        </CloseIcon>
        <Heading>Neuen Baum hinzufügen</Heading>
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            createTreeMutation.mutate({ input: { name } });
          }}
        >
          <Field
            label="Name"
            variant="inline"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Button
            variant="primary"
            outlined
            css={{ marginTop: "$6", alignSelf: "flex-end" }}
          >
            Erstellen
          </Button>
        </Form>
      </Content>
    </Dialog.Root>
  );
};
