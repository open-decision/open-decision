import { Form, Dialog, Text } from "@open-decision/design-system";
import { useTranslations } from "next-intl";
import * as React from "react";
import { useDeleteOptions, useTreeAPI } from "../../../Data/useTreeAPI";

type Props = {
  tree: { name: string; uuid: string };
  open?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
  focusOnCancel?: () => void;
  className?: string;
  children?: Dialog.TriggerProps["children"];
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
  onDelete,
  onBeforeDelete,
  onAfterDelete,
}: Props) {
  const t = useTranslations("common.deleteTreeDialog");
  const methods = Form.useForm({
    defaultValues: { treeName: "" },
    resolver: (values) => {
      return values.treeName === tree.name
        ? { values, errors: {} }
        : {
            values: {},
            errors: {
              treeName: {
                message: "Der Projektname stimmt nicht überein.",
                type: "pattern",
              },
            },
          };
    },
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

  const onSubmit = methods.handleSubmit(() =>
    deleteTree({ params: { uuid: tree.uuid } }, { onSuccess })
  );

  return (
    <Dialog.Root open={open} onOpenChange={onCancel}>
      {children ? <Dialog.Trigger asChild>{children}</Dialog.Trigger> : null}
      <Dialog.Portal>
        <Dialog.Content
          onCloseAutoFocus={!isSuccess ? focusOnCancel : undefined}
          className={className}
        >
          <Dialog.Header className="mb-2">{t("title")}</Dialog.Header>
          <Dialog.Description asChild>
            <Text className="mb-4 text-gray11">
              {t.rich("description", {
                treeName: tree.name,
                bold: (children) => (
                  <span className="text-gray12">{children}</span>
                ),
              })}
            </Text>
          </Dialog.Description>
          <Form.Root methods={methods} onSubmit={onSubmit}>
            <Form.Field Label={t("treeNameInput.label")}>
              <Form.Input
                {...methods.register("treeName")}
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
