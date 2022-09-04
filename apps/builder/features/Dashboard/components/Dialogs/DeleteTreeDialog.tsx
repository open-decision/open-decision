import {
  Form,
  Dialog,
  DialogTriggerProps,
  Text,
  styled,
  StyleObject,
} from "@open-decision/design-system";
import { useTranslations } from "next-intl";
import * as React from "react";
import { useDeleteOptions, useTreeAPI } from "../../../Data/useTreeAPI";

const Bold = styled("span", { color: "$gray12" });

type Props = {
  tree: { name: string; uuid: string };
  open?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
  focusOnCancel?: () => void;
  className?: string;
  children?: DialogTriggerProps["children"];
  css?: StyleObject;
  onDelete?: useDeleteOptions["onSuccess"];
  onBeforeDelete?: useDeleteOptions["onMutate"];
  onAfterDelete?: useDeleteOptions["onSettled"];
};

export function DeleteTreeDialog({
  tree,
  open,
  onSuccess,
  onCancel,
  focusOnCancel,
  children,
  className,
  css,
  onDelete,
  onBeforeDelete,
  onAfterDelete,
}: Props) {
  const t = useTranslations("common.deleteTreeDialog");
  const formState = Form.useFormState({
    defaultValues: { treeName: "" },
  });

  const {
    mutate: deleteTree,
    isLoading,
    isSuccess,
  } = useTreeAPI().useDelete({
    onSuccess: onDelete,
    onMutate: onBeforeDelete,
    onSettled: onAfterDelete,
  });

  formState.useSubmit(async () => {
    deleteTree({ params: { uuid: tree.uuid } }, { onSuccess });
  });

  formState.useValidate(() => {
    if (tree.name !== formState.values.treeName)
      formState.setError(
        formState.names.treeName,
        "Der Projektname ist nicht korrekt"
      );
  });

  return (
    <Dialog.Root open={open} onOpenChange={onCancel}>
      {children ? <Dialog.Trigger asChild>{children}</Dialog.Trigger> : null}
      <Dialog.Portal>
        <Dialog.Content
          onCloseAutoFocus={!isSuccess ? focusOnCancel : undefined}
          className={className}
          css={css}
        >
          <Dialog.Header css={{ marginBottom: "$2" }}>
            {t("title")}
          </Dialog.Header>
          <Dialog.Description asChild>
            <Text css={{ marginBottom: "$4", color: "$gray11" }}>
              {t.rich("description", {
                treeName: tree.name,
                bold: (children) => <Bold>{children}</Bold>,
              })}
            </Text>
          </Dialog.Description>
          <Form.Root state={formState} resetOnSubmit={false}>
            <Form.Field Label={t("treeNameInput.label")}>
              <Form.Input
                name={formState.names.treeName}
                required
                placeholder={tree.name}
              />
            </Form.Field>
            <Dialog.ButtonRow isLoading={isLoading} colorScheme="danger">
              {t("submit")}
            </Dialog.ButtonRow>
          </Form.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
