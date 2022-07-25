import * as React from "react";
import { Form, Dialog, DialogTriggerProps } from "@open-decision/design-system";
import { proxiedOD } from "../../../../features/Data/odClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { treesQueryKey } from "../../../Data/useTreesQuery";

type Props = DialogTriggerProps & {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  focusOnClose?: () => void;
};

export const CreateTreeDialog = ({
  children,
  focusOnClose,
  open,
  setOpen,
}: Props) => {
  const queryClient = useQueryClient();
  const formState = Form.useFormState({ defaultValues: { treeName: "" } });

  formState.useSubmit(() => {
    createTree(formState.values.treeName);
  });

  const { mutate: createTree, isLoading } = useMutation(
    ["createTree"],
    (name: string) => proxiedOD.trees.create({ body: { name } }),
    {
      onSuccess: () => {
        setOpen?.(false);
        queryClient.invalidateQueries(treesQueryKey);
      },
    }
  );

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {children ? <Dialog.Trigger asChild>{children}</Dialog.Trigger> : null}
      <Dialog.Content onCloseAutoFocus={focusOnClose}>
        <Dialog.Header css={{ marginBottom: "$4" }}>
          Neues Projekt erstellen
        </Dialog.Header>
        <Form.Root
          validateOnBlur={false}
          state={formState}
          css={{ display: "flex", flexDirection: "column" }}
        >
          <Form.Field
            Label={<Dialog.Description>Projektname</Dialog.Description>}
          >
            <Form.Input name={formState.names.treeName} required autoFocus />
          </Form.Field>
          <Dialog.ButtonRow isLoading={isLoading} colorScheme="success">
            Erstellen
          </Dialog.ButtonRow>
        </Form.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
};
