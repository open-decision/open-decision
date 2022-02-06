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
import { useTree } from "../state/useTree";
import { useNotificationStore } from "features/Notifications/NotificationState";

type HeaderProps = {
  css?: StyleObject;
};

export const EditorHeader = ({ css }: HeaderProps) => {
  const [hasNode] = useTree(
    (state) => Object.values(state.treeData).length > 0
  );

  const { addNotification } = useNotificationStore();

  return (
    <BaseHeader css={css}>
      <TreeNameInput />
      <Box css={{ display: "flex", gap: "$2", marginLeft: "auto" }}>
        {hasNode ? (
          <Link passHref href="/vorschau">
            <SystemLink
              className={buttonStyles({ variant: "tertiary", size: "small" })}
              underline={false}
            >
              Vorschau
            </SystemLink>
          </Link>
        ) : (
          <Button
            variant="tertiary"
            size="small"
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
