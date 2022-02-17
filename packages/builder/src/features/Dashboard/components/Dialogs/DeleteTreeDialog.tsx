import {
  useForm,
  Label,
  Input,
  ValidationMessage,
  Dialog,
  DialogTriggerProps,
  Text,
} from "@open-legal-tech/design-system";
import {
  TreesQuery,
  useDeleteTreeMutation,
} from "features/Data/generated/graphql";
import { queryClient } from "features/Data/queryClient";
import * as React from "react";
import {
  DashboardDialog,
  DashboardDialogProps,
} from "./DashboardDialogPrimitive";

type Props = DialogTriggerProps & {
  tree: TreesQuery["decisionTrees"][0];
  open: boolean;
  setOpen: (open: boolean) => void;
  focusOnClose?: () => void;
} & DashboardDialogProps;

export function DeleteTreeDialog({
  tree,
  open,
  setOpen,
  focusOnClose,
  children,
}: Props) {
  const [Form, { register }] = useForm({ defaultValues: { treeName: "" } });

  const { mutate: deleteTree, isLoading } = useDeleteTreeMutation({
    onSuccess: () => {
      queryClient.invalidateQueries("Trees");
      setOpen(false);
    },
  });

  return (
    <DashboardDialog.Root open={open} onOpenChange={setOpen}>
      {children ? (
        <DashboardDialog.Trigger>{children}</DashboardDialog.Trigger>
      ) : null}
      <DashboardDialog.Content onCloseAutoFocus={focusOnClose}>
        <DashboardDialog.Header>Projekt löschen</DashboardDialog.Header>
        <DashboardDialog.Description asChild>
          <Text css={{ marginBottom: "$6" }}>
            Bitte geben Sie den Namen des Projekts: <strong>{tree.name}</strong>{" "}
            zur Bestätigung der Löschung ein.
          </Text>
        </DashboardDialog.Description>
        <Form
          css={{ display: "flex", flexDirection: "column" }}
          onSubmit={() => deleteTree({ id: tree.id })}
        >
          <DashboardDialog.Description asChild>
            <Label size="small" htmlFor="treeName">
              Projektname
            </Label>
          </DashboardDialog.Description>
          <Input
            autoFocus
            {...register("treeName", {
              required: {
                value: true,
                message: "Es muss ein Name vergeben werden.",
              },
              validate: (val) =>
                val === tree.name ? true : "Die Namen stimmen nicht überein.",
            })}
            name="treeName"
            id="treeName"
            css={{ marginBlock: "$2" }}
            required
          />
          <ValidationMessage name="treeName" />
          <DashboardDialog.SubmitButton
            isLoading={isLoading}
            colorScheme="danger"
          >
            Löschen
          </DashboardDialog.SubmitButton>
        </Form>
      </DashboardDialog.Content>
    </DashboardDialog.Root>
  );
}
