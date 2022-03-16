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
import { useRouter } from "next/router";
import { useIsPreviewable } from "../state/treeStore/hooks";

type HeaderProps = {
  css?: StyleObject;
};

export const EditorHeader = ({ css }: HeaderProps) => {
  const { addNotification } = useNotificationStore();
  const {
    query: { id },
  } = useRouter();

  const isPreviewable = useIsPreviewable();

  return (
    <BaseHeader css={css}>
      <TreeNameInput />
      <Box css={{ display: "flex", gap: "$2", marginLeft: "auto" }}>
        {isPreviewable && id ? (
          <Link passHref href={`/builder/${id}/preview`}>
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
                  "Die Vorschau kann nur aufgerufen werden wenn es mindestens einen Startknoten gibt",
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
