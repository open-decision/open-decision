import {
  Form,
  Dialog,
  DialogTriggerProps,
  StyleObject,
} from "@open-decision/design-system";
import { useUpdateTreeMutation } from "features/Data/generated/graphql";
import { queryClient } from "features/Data/queryClient";
import * as React from "react";

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
      data: { name: { set: formState.values.treeName } },
      uuid: treeId,
    });
  });

  const { mutate: updateTree, isLoading } = useUpdateTreeMutation({
    onSuccess: () => {
      setOpen?.(false);
      queryClient.invalidateQueries("Trees");
      queryClient.invalidateQueries("getTreeName");
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
        >
          <Form.Field
            state={formState}
            label={<Dialog.Description> Projektname</Dialog.Description>}
          >
            <Form.Input
              name={formState.names.treeName}
              placeholder="Mein Projektname"
              required
            />
          </Form.Field>
          <Dialog.ButtonRow isLoading={isLoading} colorScheme="success">
            Erstellen
          </Dialog.ButtonRow>
        </Form.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
}
