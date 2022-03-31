import {
  useForm,
  Label,
  Input,
  ValidationMessage,
  Dialog,
  DialogTriggerProps,
  Text,
  styled,
} from "@open-decision/design-system";
import {
  TreesQuery,
  useDeleteTreeMutation,
} from "features/Data/generated/graphql";
import { queryClient } from "features/Data/queryClient";
import * as React from "react";

const Bold = styled("span", { color: "$gray12" });

type Props = DialogTriggerProps & {
  tree: TreesQuery["decisionTrees"][0];
  open?: boolean;
  setOpen?: (open: boolean) => void;
  focusOnClose?: () => void;
};

export function DeleteTreeDialog({
  tree,
  open,
  setOpen,
  focusOnClose,
  children,
}: Props) {
  const [Form, { register }] = useForm({
    defaultValues: { treeName: "" },
  });

  const { mutate: deleteTree, isLoading } = useDeleteTreeMutation({
    onSuccess: () => {
      queryClient.invalidateQueries("Trees");
      setOpen?.(false);
    },
  });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {children ? <Dialog.Trigger asChild>{children}</Dialog.Trigger> : null}
      <Dialog.Content onCloseAutoFocus={focusOnClose}>
        <Dialog.Header css={{ marginBottom: "$2" }}>
          Projekt löschen
        </Dialog.Header>
        <Dialog.Description asChild>
          <Text css={{ marginBottom: "$4" }}>
            Bitte geben Sie den Namen des Projekts: <Bold>{tree.name}</Bold> zur
            Bestätigung der Löschung ein.
          </Text>
        </Dialog.Description>
        <Form
          css={{ display: "flex", flexDirection: "column" }}
          onSubmit={() => deleteTree({ uuid: tree.uuid })}
        >
          <Label size="small" htmlFor="treeName">
            Projektname
          </Label>
          <Input
            {...register("treeName", {
              required: {
                value: true,
                message: "Es muss ein Name vergeben werden.",
              },
              validate: (val) =>
                val === tree.name ? true : "Die Namen stimmen nicht überein.",
            })}
            placeholder={tree.name}
            name="treeName"
            id="treeName"
            css={{ marginBlock: "$2", layer: "2" }}
            required
          />
          <ValidationMessage name="treeName" />
          <Dialog.ButtonRow isLoading={isLoading} colorScheme="danger">
            Löschen
          </Dialog.ButtonRow>
        </Form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
