import * as React from "react";
import {
  Dialog,
  Link,
  Text,
  Form,
  Stack,
  buttonClasses,
} from "@open-decision/design-system";
import { readableDate } from "../../../features/Dashboard/utils";
import { useTreeAPI } from "@open-decision/api-react-binding";
import { useTranslations } from "next-intl";

type Props = {
  open?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
  focusOnCancel?: () => void;
  className?: string;
  children?: Dialog.TriggerProps["children"];
  treeId: string;
  treeName?: string;
};

export function ExportDialog({
  children,
  open,
  onSuccess,
  onCancel,
  focusOnCancel,
  className,
  treeId,
  treeName,
}: Props) {
  const t = useTranslations("common.exportDialog");
  const {
    mutate,
    data: fileUrl,
    isLoading,
    isSuccess,
  } = useTreeAPI().useExport(treeId);

  const methods = Form.useForm({
    defaultValues: {
      name: `${treeName ?? "Unbennant"}_${readableDate(new Date())}`,
    },
  });

  return (
    <Dialog.Root open={open} onOpenChange={onCancel}>
      {children ? <Dialog.Trigger asChild>{children}</Dialog.Trigger> : null}
      <Dialog.Portal>
        <Dialog.Content
          className={className}
          onCloseAutoFocus={!isSuccess ? focusOnCancel : undefined}
        >
          <Dialog.Header>{t("title")}</Dialog.Header>
          {!fileUrl ? (
            <>
              <Dialog.Description asChild>
                <Text className="mt-2">{t("customization.description")}</Text>
              </Dialog.Description>
              <Form.Root
                methods={methods}
                onSubmit={methods.handleSubmit(() =>
                  mutate({
                    name: treeName ?? "Unbennant",
                  })
                )}
                className="mt-4"
              >
                <Form.Field Label={t("customization.nameInput.label")}>
                  <Form.Input {...methods.register("name")} />
                </Form.Field>
                <Form.SubmitButton
                  isLoading={isLoading}
                  className="mt-2 ml-auto"
                >
                  {t("customization.submit")}
                </Form.SubmitButton>
              </Form.Root>
            </>
          ) : (
            <Stack>
              <Dialog.Description asChild>
                <Text className="mt-2">{t("save.description")}</Text>
              </Dialog.Description>
              <Link
                className={buttonClasses({}, ["mt-4 self-end"])}
                download={`${methods.watch("name")}.json`}
                href={fileUrl}
                onClick={onSuccess}
              >
                {t("save.cta")}
              </Link>
            </Stack>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
