import * as React from "react";
import {
  Label,
  Input,
  useForm,
  ValidationMessage,
} from "@open-legal-tech/design-system";
import { useCreateTreeMutation } from "features/Data/generated/graphql";
import { queryClient } from "features/Data/queryClient";
import {
  DashboardDialog,
  DashboardDialogProps,
} from "./DashboardDialogPrimitive";

export const CreateTreeDialog = ({ children }: DashboardDialogProps) => {
  const [Form, { register }] = useForm({ defaultValues: { treeName: "" } });

  const [open, setOpen] = React.useState(false);

  const { mutate: createTree, isLoading } = useCreateTreeMutation({
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
      <DashboardDialog.Content>
        <DashboardDialog.Header>Neues Projekt erstellen</DashboardDialog.Header>
        <Form
          css={{ display: "flex", flexDirection: "column" }}
          onSubmit={({ treeName }) => createTree({ data: { name: treeName } })}
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
};
