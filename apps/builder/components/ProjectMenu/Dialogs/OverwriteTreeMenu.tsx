import { Dialog, Text } from "@open-decision/design-system";
import { useTranslations } from "next-intl";
import * as React from "react";
import { TreeImport } from "../../../features/Dashboard/TreeImport";

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
  open,
  onSuccess,
  onCancel,
  focusOnCancel,
  children,
  className,
}: Props) {
  const t = useTranslations("common.overwriteTreeDialog");

  return (
    <Dialog.Root open={open} onOpenChange={onCancel}>
      {children ? <Dialog.Trigger asChild>{children}</Dialog.Trigger> : null}
      <Dialog.Portal>
        <Dialog.Content className={className} onCloseAutoFocus={focusOnCancel}>
          <Dialog.Header className="mb-4">{t("title")}</Dialog.Header>
          <Text>{t("description")}</Text>
          <TreeImport className="font-[500]" onDone={onSuccess}>
            Bauminhalt überschreiben
          </TreeImport>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
