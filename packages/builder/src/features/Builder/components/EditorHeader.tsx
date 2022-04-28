import {
  buttonStyles,
  StyleObject,
  Link as SystemLink,
  Button,
  Icon,
  Row,
} from "@open-decision/design-system";
import { BaseHeader } from "components";
import Link from "next/link";
import { useNotificationStore } from "features/Notifications/NotificationState";
import { useRouter } from "next/router";
import { useIsPreviewable } from "../state/treeStore/hooks";
import { ProjectMenu } from "./ProjectMenu";
import { FileTextIcon } from "@radix-ui/react-icons";
import { NodeSearch } from "./NodeSearch";
import { queryClient } from "features/Data/queryClient";
import { useTreeContext } from "../state/treeStore/TreeContext";

type HeaderProps = {
  css?: StyleObject;
};

export const EditorHeader = ({ css }: HeaderProps) => {
  const { addNotification } = useNotificationStore();
  const {
    query: { id },
  } = useRouter();
  const { getTreeData } = useTreeContext();

  const isPreviewable = useIsPreviewable();

  return (
    <BaseHeader css={css} LogoSlot={<ProjectMenu />}>
      <Row css={{ gap: "$3", alignItems: "center", width: "100%" }}>
        <NodeSearch />
      </Row>
      {isPreviewable && id ? (
        <Link passHref href={`/builder/${id}/preview`}>
          <SystemLink
            className={buttonStyles({ variant: "secondary" })}
            onClick={() => {
              const tree = getTreeData();
              return queryClient.setQueryData(
                ["getTreeContent", { uuid: id }],
                { decisionTree: { treeData: tree } }
              );
            }}
          >
            <Icon>
              <FileTextIcon />
            </Icon>
            Vorschau
          </SystemLink>
        </Link>
      ) : (
        <Button
          variant="secondary"
          onClick={() =>
            addNotification({
              variant: "info",
              title: "Keine Knoten",
              content:
                "Die Vorschau kann nur aufgerufen werden wenn es mindestens einen Startknoten gibt",
            })
          }
        >
          <Icon>
            <FileTextIcon />
          </Icon>
          Vorschau
        </Button>
      )}
    </BaseHeader>
  );
};
