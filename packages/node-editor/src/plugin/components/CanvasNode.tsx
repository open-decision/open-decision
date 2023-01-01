import {
  Badge,
  Icon,
  Stack,
  textClasses,
  twMerge,
} from "@open-decision/design-system";
import * as React from "react";
import { Handle, Position } from "reactflow";
import { useTranslations } from "next-intl";
import { useSubscribedTreeClient, useTree } from "@open-decision/tree-sync";
import { StartNodeLabel } from "./StartNodeLabels";
import { useEditor } from "../../state";
import { nodeWidth, nodeHeight } from "../../utils/constants";
import { targetPortClasses, portWidth, sourcePortClasses } from "./Port";
import { MoonIcon } from "@radix-ui/react-icons";
import { NodePluginProps } from "@open-decision/plugins-node-helpers";

type Props = { className?: string };

export function FinalNodeLabel({ className }: Props) {
  const t = useTranslations("builder.nodeEditingSidebar.nodeLabels");
  return (
    <Badge className={twMerge("colorScheme-warning", className)}>
      <Icon>
        <MoonIcon />
      </Icon>
      {t("finalNode")}
    </Badge>
  );
}

const nodeContainerClasses =
  "bg-layer-1 rounded-md border border-gray7 [&[data-connecting=false]:hover]:border-primary9 [&[data-connecting=true][data-connectable=true]]:cursor-crosshair [&[data-connecting=true][data-connectable=false]]:cursor-not-allowed";

export const CanvasNodeContainer = ({
  id,
  selected: isSelected,
  children,
  zIndex,
  className,
}: NodePluginProps & {
  children: React.ReactNode;
}) => {
  const node = useTree((treeClient) => treeClient.nodes.get.single(id));

  const t = useTranslations("builder.canvas.questionNode");
  const {
    isConnecting,
    connectingNodeId,
    editorStore: { validConnections },
  } = useEditor();

  const subscribedTreeClient = useSubscribedTreeClient();
  const startNodeId = subscribedTreeClient.get.startNodeId();

  const validConnectionTarget = React.useMemo(
    () => !isConnecting || (isConnecting && validConnections?.includes(id)),
    [isConnecting, validConnections, id]
  );

  const isStartNode = startNodeId === id;
  const isConnectingNode = connectingNodeId === id;
  const connectable = validConnectionTarget && !isConnectingNode;

  if (node instanceof Error) return null;

  return (
    <Stack
      center
      classNames={[
        nodeContainerClasses,
        isSelected
          ? "shadow-6 border-2 border-primary10 p-[calc(var(--space-5)-1px)]"
          : "shadow-3 border border-gray8 p-5",
        "text-center",
        className,
      ]}
      aria-label={t("empty.hiddenLabel", {
        content: (node?.name?.length ?? 0) > 0 ? true : null,
        name: node?.name,
        selected: isSelected,
      })}
      data-nodeid={id}
      data-connecting={isConnecting}
      data-connectable={connectable}
      style={{
        opacity: validConnectionTarget ? 1 : 0.5,
        zIndex,
        width: nodeWidth,
        height: nodeHeight,
      }}
    >
      {isStartNode ? (
        <StartNodeLabel className="absolute top-[-14px] left-[-14px]" />
      ) : null}
      {node?.final ? (
        <FinalNodeLabel className="absolute top-[-14px] left-[-14px]" />
      ) : null}
      <Handle
        className={targetPortClasses}
        style={{
          height: `${portWidth}px `,
          width: `${portWidth}px`,
          top: `-${portWidth / 2}px`,
        }}
        type="target"
        data-connecting={isConnecting}
        data-connectingnode={isConnectingNode}
        data-connectable={connectable}
        position={Position.Top}
        id={id}
        isConnectable={isConnecting}
        data-test={`${id}-target-port`}
      />
      <span
        data-connecting={isConnecting}
        data-nodeid={id}
        className={textClasses({}, ["align-center"])}
      >
        {children}
      </span>
      {!node?.final ? (
        <Handle
          className={sourcePortClasses}
          style={{
            width: `${portWidth}px`,
            height: `${portWidth}px `,
            bottom: `-${(portWidth - 2) / 2}px`,
          }}
          type="source"
          data-connecting={isConnecting}
          data-connectingnode={isConnectingNode}
          data-connectable={connectable}
          position={Position.Bottom}
          data-active={isConnecting && connectingNodeId === id}
          data-test={`${id}-source-port`}
        />
      ) : null}
    </Stack>
  );
};
