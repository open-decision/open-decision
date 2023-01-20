import { Form, Dialog } from "@open-decision/design-system";
import { useTranslations } from "next-intl";
import * as React from "react";
import { useTreeAPI } from "@open-decision/api-react-binding";

type Props = {
  treeId: string;
  open?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
  focusOnCancel?: () => void;
  className?: string;
  children?: Dialog.TriggerProps["children"];
};

export function OverwriteTreeDialog({
  treeId,
  open,
  onSuccess,
  onCancel,
  focusOnCancel,
  children,
  className,
}: Props) {
  const t = useTranslations("common.overwriteTreeDialog");
  const methods = Form.useForm({ defaultValues: { treeName: "" } });

  const {
    mutate: updateTree,
    isLoading,
    isSuccess,
  } = useTreeAPI().useUpdate({
    notification: "updateProject",
    onSuccess,
  });

  return (
    <Dialog.Root open={open} onOpenChange={onCancel}>
      {children ? <Dialog.Trigger asChild>{children}</Dialog.Trigger> : null}
      <Dialog.Portal>
        <Dialog.Content
          onCloseAutoFocus={!isSuccess ? focusOnCancel : undefined}
          className={className}
        >
          <Dialog.Header className="mb-4">{t("title")}</Dialog.Header>
          <Form.Root
            methods={methods}
            onSubmit={methods.handleSubmit((values) =>
              updateTree({
                body: { name: values.treeName },
                params: { uuid: treeId },
              })
            )}
          >
            <Form.Field
              Label={
                <Dialog.Description>
                  {t("treeNameInput.label")}
                </Dialog.Description>
              }
            >
              <Form.Input
                {...methods.register("treeName", { required: true })}
                placeholder={t("treeNameInput.placeholder")}
                required
              />
            </Form.Field>
            <Dialog.ButtonRow isLoading={isLoading} colorScheme="success">
              {t("submit")}
            </Dialog.ButtonRow>
          </Form.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
