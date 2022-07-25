import {
  Form,
  Dialog,
  DialogTriggerProps,
  Text,
  styled,
  StyleObject,
} from "@open-decision/design-system";
import * as React from "react";
import { useTreeAPI } from "../../../Data/useTreeAPI";

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
  const formState = Form.useFormState({
    defaultValues: { treeName: "" },
  });

  formState.useSubmit(() => {
    deleteTree({ params: { uuid: tree.uuid } });
  });

  formState.useValidate(() => {
    if (tree.name !== formState.values.treeName)
      formState.setError(
        formState.names.treeName,
        "Der Projektname ist nicht korrekt"
      );
  });

  const { mutate: deleteTree, isLoading } = useTreeAPI().useDelete({
    onSuccess: () => {
      setOpen?.(false);
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
          <Text css={{ marginBottom: "$4", color: "$gray11" }}>
            Bitte geben Sie den Namen des Projekts: <Bold>{tree.name}</Bold> zur
            Bestätigung der Löschung ein.
          </Text>
        </Dialog.Description>
        <Form.Root state={formState} validateOnBlur={false}>
          <Form.Field Label="Projektname">
            <Form.Input
              name={formState.names.treeName}
              required
              placeholder={tree.name}
            />
          </Form.Field>
          <Dialog.ButtonRow isLoading={isLoading} colorScheme="danger">
            Löschen
          </Dialog.ButtonRow>
        </Form.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
}
