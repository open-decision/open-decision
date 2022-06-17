import * as React from "react";
import { Form, Dialog, DialogTriggerProps } from "@open-decision/design-system";
import { queryClient } from "../../../../features/Data/queryClient";
import { useOD } from "../../../../features/Data/odClient";
import { useMutation } from "react-query";
import { useTreesQueryKey } from "../../../Data/useTreesQuery";

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
  const formState = Form.useFormState({ defaultValues: { treeName: "" } });

  formState.useSubmit(() => {
    createTree(formState.values.treeName);
  });

  const OD = useOD();

  const { mutate: createTree, isLoading } = useMutation(
    (name: string) => OD.trees.create({ body: { name } }),
    {
      onSuccess: () => {
        setOpen?.(false);
        queryClient.invalidateQueries(useTreesQueryKey);
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
