import {
  useForm,
  Label,
  Input,
  ValidationMessage,
  DialogTriggerProps,
} from "@open-legal-tech/design-system";
import { useUpdateTreeMutation } from "features/Data/generated/graphql";
import { queryClient } from "features/Data/queryClient";
import * as React from "react";
import {
  DashboardDialog,
  DashboardDialogProps,
} from "./DashboardDialogPrimitive";

type Props = DialogTriggerProps & {
  treeId: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  focusOnClose?: () => void;
} & DashboardDialogProps;

export function UpdateTreeDialog({
  treeId,
  open,
  setOpen,
  focusOnClose,
  children,
}: Props) {
  const [Form, { register }] = useForm({ defaultValues: { treeName: "" } });

  const { mutate: updateTree, isLoading } = useUpdateTreeMutation({
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
      <DashboardDialog.Content
        css={{ minWidth: "350px", paddingTop: "$2", zIndex: "$10" }}
        onCloseAutoFocus={focusOnClose}
      >
        <DashboardDialog.Header>Projektname ändern</DashboardDialog.Header>
        <Form
          css={{ display: "flex", flexDirection: "column" }}
          onSubmit={({ treeName }) =>
            updateTree({ data: { name: { set: treeName } }, id: treeId })
          }
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
            })}
            name="treeName"
            id="treeName"
            css={{ marginBlock: "$2" }}
            required
          />
          <ValidationMessage name="treeName" />
          <DashboardDialog.SubmitButton
            isLoading={isLoading}
            colorScheme="success"
          >
            Erstellen
          </DashboardDialog.SubmitButton>
        </Form>
      </DashboardDialog.Content>
    </DashboardDialog.Root>
  );
}
