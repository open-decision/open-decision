import * as React from "react";
import {
  Icon,
  Link as SystemLink,
  StyleObject,
} from "@open-decision/design-system";
import { FileTextIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useHasStartNode } from "../state/treeStore/hooks";
import { useNotificationStore } from "../../Notifications/NotificationState";
import { useTreeId } from "../../Data/useTreeId";

type PreviewLinkProps = {
  children: React.ReactNode;
  initialNode?: string;
  css?: StyleObject;
  className?: string;
};

function PreviewLinkImpl(
  { children, initialNode, className, css }: PreviewLinkProps,
  ref: React.Ref<HTMLAnchorElement>
) {
  const hasStartNode = useHasStartNode();
  const { addNotification } = useNotificationStore();
  const id = useTreeId();

  return hasStartNode || initialNode ? (
    <Link passHref href={`/builder/${id}/preview`}>
      <SystemLink
        className={className}
        css={{ textDecoration: "none !important", ...css }}
        ref={ref}
      >
        {children}
      </SystemLink>
    </Link>
  ) : (
    <SystemLink
      data-disabled
      className={className}
      css={css}
      onClick={() =>
        addNotification({
          variant: "info",
          title: "Keine Knoten",
          content:
            "Die Vorschau kann nur aufgerufen werden wenn es mindestens einen Startknoten gibt",
        })
      }
      ref={ref}
    >
      <Icon>
        <FileTextIcon />
      </Icon>
      Vorschau
    </SystemLink>
  );
}

export const PreviewLink = React.forwardRef(PreviewLinkImpl);
