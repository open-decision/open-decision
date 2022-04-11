import {
  Box,
  buttonStyles,
  StyleObject,
  Link as SystemLink,
  Button,
  Icon,
  Row,
} from "@open-decision/design-system";
import { BaseHeader } from "components";
import { TreeNameInput } from "./TreeNameInput";
import Link from "next/link";
import { ExportDialog } from "./ExportDialog";
import { useNotificationStore } from "features/Notifications/NotificationState";
import { useRouter } from "next/router";
import { useIsPreviewable } from "../state/treeStore/hooks";
import { ProjectMenu } from "./ProjectMenu";
import { ChevronRight } from "react-feather";

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
    <BaseHeader css={css} LogoSlot={<ProjectMenu />}>
      <Row css={{ gap: "$3", alignItems: "center", width: "100%" }}>
        <Link passHref href="/">
          <SystemLink underline={false} css={{ fontWeight: "500" }}>
            Meine Projekte
          </SystemLink>
        </Link>
        <Icon>
          <ChevronRight />
        </Icon>
        <TreeNameInput />
      </Row>
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
        <ExportDialog>
          <Button variant="secondary">Export</Button>
        </ExportDialog>
      </Box>
    </BaseHeader>
  );
};
