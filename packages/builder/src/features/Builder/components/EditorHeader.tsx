import {
  Box,
  buttonStyles,
  StyleObject,
  Link as SystemLink,
  Button,
} from "@open-decision/design-system";
import { BaseHeader } from "components";
import { TreeNameInput } from "./TreeNameInput";
import Link from "next/link";
import { ExportButton } from "./ExportButton";
import { useNotificationStore } from "features/Notifications/NotificationState";
import { hasNodes } from "../state/treeStore/treeStore";
import { useRouter } from "next/router";

type HeaderProps = {
  css?: StyleObject;
};

export const EditorHeader = ({ css }: HeaderProps) => {
  const { addNotification } = useNotificationStore();
  const {
    query: { id },
  } = useRouter();

  return (
    <BaseHeader css={css}>
      <TreeNameInput />
      <Box css={{ display: "flex", gap: "$2", marginLeft: "auto" }}>
        {hasNodes() && id ? (
          <Link passHref href={`/preview/${id}`}>
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
