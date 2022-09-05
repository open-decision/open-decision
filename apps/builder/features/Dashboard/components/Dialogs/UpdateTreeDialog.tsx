import {
  Form,
  Dialog,
  DialogTriggerProps,
  StyleObject,
} from "@open-decision/design-system";
import { useTranslations } from "next-intl";
import * as React from "react";
import { useTreeAPI } from "../../../Data/useTreeAPI";

type Props = {
  treeId: string;
  open?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
  focusOnCancel?: () => void;
  className?: string;
  children?: DialogTriggerProps["children"];
  css?: StyleObject;
};

export function UpdateTreeDialog({
  treeId,
  open,
  onSuccess,
  onCancel,
  focusOnCancel,
  children,
  className,
  css,
}: Props) {
  const t = useTranslations("common.updateTreeDialog");
  const formState = Form.useFormState({ defaultValues: { treeName: "" } });

  const {
    mutate: updateTree,
    isLoading,
    isSuccess,
  } = useTreeAPI().useUpdate({
    notification: "updateProject",
    onSuccess,
  });

  formState.useSubmit(() => {
    updateTree({
      body: { name: formState.values.treeName },
      params: { uuid: treeId },
    });
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
          <Dialog.Header css={{ marginBottom: "$4" }}>
            {t("title")}
          </Dialog.Header>
          <Form.Root state={formState}>
            <Form.Field
              Label={
                <Dialog.Description>
                  {t("treeNameInput.label")}
                </Dialog.Description>
              }
            >
              <Form.Input
                name={formState.names.treeName}
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
