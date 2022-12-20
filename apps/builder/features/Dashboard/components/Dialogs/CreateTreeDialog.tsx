import * as React from "react";
import { Form, Dialog, stackClasses } from "@open-decision/design-system";
import { useCreateOptions, useTreeAPI } from "../../../Data/useTreeAPI";
import { useTranslations } from "next-intl";

type Props = Dialog.TriggerProps & {
  open?: boolean;
  focusOnCancel?: () => void;
  onSuccess?: () => void;
  onCancel?: () => void;
  onCreate?: useCreateOptions["onSuccess"];
  onBeforeCreate?: useCreateOptions["onMutate"];
  onAfterCreate?: useCreateOptions["onSettled"];
};

export const CreateTreeDialog = ({
  children,
  focusOnCancel,
  open,
  onSuccess,
  onCancel,
  onCreate,
  onBeforeCreate,
  onAfterCreate,
}: Props) => {
  const t = useTranslations("common.createTreeDialog");
  const methods = Form.useForm({ defaultValues: { treeName: "" } });

  const {
    mutate: createTree,
    isLoading,
    isSuccess,
  } = useTreeAPI().useCreate({
    onSuccess: onCreate,
    onMutate: onBeforeCreate,
    onSettled: onAfterCreate,
  });

  const onSubmit = methods.handleSubmit((values) => {
    createTree({ body: { name: values.treeName } }, { onSuccess });
  });

  return (
    <Dialog.Root open={open} onOpenChange={onCancel}>
      {children ? <Dialog.Trigger asChild>{children}</Dialog.Trigger> : null}
      <Dialog.Portal>
        <Dialog.Content
          onCloseAutoFocus={!isSuccess ? focusOnCancel : undefined}
        >
          <Dialog.Header className="mb-4">{t("title")}</Dialog.Header>
          <Form.Root
            methods={methods}
            className={stackClasses()}
            onSubmit={onSubmit}
          >
            <Form.Field
              Label={
                <Dialog.Description>
                  {t("treeNameInput.label")}
                </Dialog.Description>
              }
            >
              <Form.Input
                {...methods.register("treeName", {
                  required: {
                    value: true,
                    message: t("treeNameInput.required"),
                  },
                })}
                placeholder={t("treeNameInput.placeholder")}
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
};
