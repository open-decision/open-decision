import {
  Box,
  buttonStyles,
  StyleObject,
  Link as SystemLink,
  Button,
} from "@open-legal-tech/design-system";
import { BaseHeader } from "components";
import { TreeNameInput } from "./TreeNameInput";
import Link from "next/link";
import { ExportButton } from "./ExportButton";
import { useNotificationStore } from "features/Notifications/NotificationState";
import { hasNodes } from "../state/treeStore/treeStore";

type HeaderProps = {
  css?: StyleObject;
};

export const EditorHeader = ({ css }: HeaderProps) => {
  const { addNotification } = useNotificationStore();

  return (
    <BaseHeader css={css}>
      <TreeNameInput />
      <Box css={{ display: "flex", gap: "$2", marginLeft: "auto" }}>
        {hasNodes() ? (
          <Link passHref href="/vorschau">
            <SystemLink
              className={buttonStyles({ variant: "tertiary" })}
              underline={false}
            >
              Vorschau
            </SystemLink>
          </Link>
        ) : (
          <Button
            variant="tertiary"
            onClick={() =>
              addNotification({
                variant: "info",
                title: "Keine Knoten",
                content:
                  "Die Vorschau kann nur aufgerufen werden wenn es mindestens einen Knoten gibt.",
              })
            }
          >
            Vorschau
          </Button>
        )}
        <ExportButton />
      </Box>
    </BaseHeader>
  );
};
