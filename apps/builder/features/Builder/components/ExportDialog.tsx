import * as React from "react";
import {
  buttonStyles,
  Dialog,
  Link,
  Text,
  Form,
  Stack,
  DialogTriggerProps,
  StyleObject,
} from "@open-decision/design-system";
import { readableDate } from "../../../features/Dashboard/utils";
import { ErrorBoundary } from "@sentry/nextjs";
import { useTreeAPI } from "../../Data/useTreeAPI";
import { useTranslations } from "next-intl";

type Props = {
  open?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
  focusOnCancel?: () => void;
  className?: string;
  children?: DialogTriggerProps["children"];
  css?: StyleObject;
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
  css,
  treeId,
  treeName,
}: Props) {
  const t = useTranslations("common.exportDialog");
  const { mutate, data, isLoading, isSuccess } = useTreeAPI().useExport(treeId);

  const formState = Form.useFormState({
    defaultValues: {
      name: `${treeName ?? "Unbennant"}_${readableDate(new Date())}`,
    },
  });

  formState.useSubmit(() => {
    mutate({
      name: treeName ?? "Unbennant",
      fileName: formState.values.name,
    });
  });

  React.useEffect(() => {
    return () => {
      if (data?.fileUrl) URL.revokeObjectURL(data.fileUrl);
    };
  }, [data?.fileUrl]);

  return (
    <Dialog.Root open={open} onOpenChange={onCancel}>
      {children ? <Dialog.Trigger asChild>{children}</Dialog.Trigger> : null}
      <Dialog.Portal>
        <Dialog.Content
          className={className}
          css={css}
          onCloseAutoFocus={!isSuccess ? focusOnCancel : undefined}
        >
          <Dialog.Header>{t("title")}</Dialog.Header>
          <ErrorBoundary fallback={ExportErrorFallback}>
            {!data?.fileUrl ? (
              <>
                <Dialog.Description asChild>
                  <Text css={{ marginTop: "$2" }}>
                    {t("customization.description")}
                  </Text>
                </Dialog.Description>
                <Form.Root
                  state={formState}
                  css={{ marginTop: "$4" }}
                  resetOnSubmit={false}
                >
                  <Form.Field Label={t("customization.nameInput.label")}>
                    <Form.Input name={formState.names.name} />
                  </Form.Field>
                  <Form.Submit
                    isLoading={isLoading}
                    css={{ marginTop: "$2", marginLeft: "auto" }}
                  >
                    {t("customization.submit")}
                  </Form.Submit>
                </Form.Root>
              </>
            ) : (
              <Stack>
                <Dialog.Description asChild>
                  <Text css={{ marginTop: "$2" }}>{t("save.description")}</Text>
                </Dialog.Description>
                <Link
                  className={buttonStyles({
                    css: { marginTop: "$4", alignSelf: "flex-end" },
                  })}
                  download={data.file.name}
                  href={data.fileUrl}
                  onClick={onSuccess}
                >
                  {t("save.cta")}
                </Link>
              </Stack>
            )}
          </ErrorBoundary>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function ExportErrorFallback() {
  const t = useTranslations("common.exportDialog");
  return <Text>{t("errorFallback")}</Text>;
}
