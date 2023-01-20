import {
  buttonClasses,
  Dialog,
  InfoBox,
  Text,
} from "@open-decision/design-system";
import { useTranslations } from "next-intl";
import * as React from "react";
import { OverwriteTreeImport } from "../../../features/Import-Export/OverwriteTreeImport";

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

  return (
    <Dialog.Root open={open} onOpenChange={onCancel}>
      {children ? <Dialog.Trigger asChild>{children}</Dialog.Trigger> : null}
      <Dialog.Portal>
        <Dialog.Content
          Above={
            <InfoBox
              title="Achtung"
              content="Das überschreiben eines Projekts kann nicht rückgängig gemacht werden."
              variant="danger"
              className="bg-danger2"
            />
          }
          className={className}
          onCloseAutoFocus={focusOnCancel}
        >
          <Dialog.Header className="mb-4">{t("title")}</Dialog.Header>
          <Text>{t("description")}</Text>
          <OverwriteTreeImport
            className={buttonClasses({}, "mt-4 colorScheme-danger")}
            onDone={onSuccess}
            treeUuid={treeId}
          >
            Bauminhalt überschreiben
          </OverwriteTreeImport>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
