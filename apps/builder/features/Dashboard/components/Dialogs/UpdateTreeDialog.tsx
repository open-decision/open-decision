import {
  Form,
  Dialog,
  DialogTriggerProps,
  StyleObject,
} from "@open-decision/design-system";
import * as React from "react";
import { useTreeAPI } from "../../../Data/useTreeAPI";

type Props = {
  treeId: string;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  focusOnClose?: () => void;
  className?: string;
  children?: DialogTriggerProps["children"];
  css?: StyleObject;
};

export function UpdateTreeDialog({
  treeId,
  open,
  setOpen,
  focusOnClose,
  children,
  className,
  css,
}: Props) {
  const formState = Form.useFormState({ defaultValues: { treeName: "" } });

  formState.useSubmit(() => {
    updateTree({
      body: { name: formState.values.treeName },
      params: { uuid: treeId },
    });
  });

  const { mutate: updateTree, isLoading } = useTreeAPI().useUpdate({
    onSuccess: () => {
      setOpen?.(false);
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
        <Dialog.Header css={{ marginBottom: "$4" }}>
          Projektname ändern
        </Dialog.Header>
        <Form.Root
          state={formState}
          css={{ display: "flex", flexDirection: "column" }}
          validateOnBlur={false}
        >
          <Form.Field
            Label={<Dialog.Description> Projektname</Dialog.Description>}
          >
            <Form.Input
              name={formState.names.treeName}
              placeholder="Mein Projektname"
              required
            />
          </Form.Field>
          <Dialog.ButtonRow isLoading={isLoading} colorScheme="success">
            Ändern
          </Dialog.ButtonRow>
        </Form.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
}
