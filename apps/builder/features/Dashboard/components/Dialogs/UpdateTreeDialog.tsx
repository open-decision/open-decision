import {
  Form,
  Dialog,
  DialogTriggerProps,
  StyleObject,
} from "@open-decision/design-system";
import { queryClient } from "../../../../features/Data/queryClient";
import * as React from "react";
import { useMutation } from "react-query";
import { proxiedOD } from "../../../../features/Data/odClient";
import { useTreeQueryKey } from "../../../Data/useTreeQuery";
import { useTreesQueryKey } from "../../../Data/useTreesQuery";

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
    updateTree();
  });

  const { mutate: updateTree, isLoading } = useMutation(
    () =>
      proxiedOD.trees.update({
        body: { name: formState.values.treeName },
        params: { uuid: treeId },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(useTreeQueryKey);
        queryClient.invalidateQueries(useTreesQueryKey);
        setOpen?.(false);
      },
    }
  );

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
