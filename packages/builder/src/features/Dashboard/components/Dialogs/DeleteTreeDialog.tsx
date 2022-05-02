import {
  useForm,
  Label,
  Input,
  ValidationMessage,
  Dialog,
  DialogTriggerProps,
  Text,
  styled,
  StyleObject,
} from "@open-decision/design-system";
import { useDeleteTreeMutation } from "features/Data/generated/graphql";
import { queryClient } from "features/Data/queryClient";
import * as React from "react";

const Bold = styled("span", { color: "$gray12" });

type Props = {
  tree: { name: string; uuid: string };
  open?: boolean;
  setOpen?: (open: boolean) => void;
  focusOnClose?: () => void;
  className?: string;
  children?: DialogTriggerProps["children"];
  css?: StyleObject;
  onDelete?: () => void;
};

export function DeleteTreeDialog({
  tree,
  open,
  setOpen,
  focusOnClose,
  children,
  className,
  css,
  onDelete,
}: Props) {
  const [Form, { register }] = useForm({
    defaultValues: { treeName: "" },
  });

  const { mutate: deleteTree, isLoading } = useDeleteTreeMutation({
    onSuccess: () => {
      setOpen?.(false);
      queryClient.invalidateQueries("Trees");
      onDelete?.();
    },
  });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {children ? <Dialog.Trigger asChild>{children}</Dialog.Trigger> : null}
      <Dialog.Content
        onCloseAutoFocus={focusOnClose}
        className={className}
        css={css}
      >
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
