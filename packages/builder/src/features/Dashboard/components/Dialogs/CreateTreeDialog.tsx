import * as React from "react";
import {
  Label,
  Input,
  useForm,
  ValidationMessage,
  Dialog,
  DialogTriggerProps,
} from "@open-decision/design-system";
import { useCreateTreeMutation } from "features/Data/generated/graphql";
import { queryClient } from "features/Data/queryClient";

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
  const [Form, { register }] = useForm({ defaultValues: { treeName: "" } });

  const { mutate: createTree, isLoading } = useCreateTreeMutation({
    onSuccess: () => {
      setOpen?.(false);
      queryClient.invalidateQueries("Trees");
    },
  });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {children ? <Dialog.Trigger asChild>{children}</Dialog.Trigger> : null}
      <Dialog.Content onCloseAutoFocus={focusOnClose}>
        <Dialog.Header css={{ marginBottom: "$4" }}>
          Neues Projekt erstellen
        </Dialog.Header>
        <Form
          css={{ display: "flex", flexDirection: "column" }}
          onSubmit={({ treeName }) => createTree({ data: { name: treeName } })}
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
};
