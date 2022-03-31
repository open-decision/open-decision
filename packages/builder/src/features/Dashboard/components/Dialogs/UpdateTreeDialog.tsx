import {
  useForm,
  Label,
  Input,
  ValidationMessage,
  Dialog,
  DialogTriggerProps,
} from "@open-decision/design-system";
import { useUpdateTreeMutation } from "features/Data/generated/graphql";
import { queryClient } from "features/Data/queryClient";
import * as React from "react";

type Props = DialogTriggerProps & {
  treeId: string;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  focusOnClose?: () => void;
};

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
      setOpen?.(false);
    },
  });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {children ? <Dialog.Trigger asChild>{children}</Dialog.Trigger> : null}
      <Dialog.Content onCloseAutoFocus={focusOnClose}>
        <Dialog.Header css={{ marginBottom: "$4" }}>
          Projektname ändern
        </Dialog.Header>
        <Form
          css={{ display: "flex", flexDirection: "column" }}
          onSubmit={({ treeName }) =>
            updateTree({ data: { name: { set: treeName } }, uuid: treeId })
          }
        >
          <Dialog.Description asChild>
            <Label size="small" htmlFor="treeName" css={{ color: "$gray12" }}>
              Projektname
            </Label>
          </Dialog.Description>
          <Input
            autoFocus
            {...register("treeName", {
              required: {
                value: true,
                message: "Es muss ein Name vergeben werden.",
              },
            })}
            placeholder="Mein Projektname"
            name="treeName"
            id="treeName"
            css={{ marginBlock: "$2", layer: "2" }}
            required
          />
          <ValidationMessage name="treeName" />
          <Dialog.ButtonRow isLoading={isLoading} colorScheme="success">
            Erstellen
          </Dialog.ButtonRow>
        </Form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
