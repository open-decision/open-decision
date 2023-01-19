import * as React from "react";
import { useInterpreter } from "@open-decision/interpreter-react";
import { Renderer } from "@open-decision/renderer";
import { clone } from "remeda";
import { GroupNodePlugin, IGroupNode } from "../GroupNodePlugin";
import { createSubTree } from "../utils/createSubtree";
import { ErrorCard, Stack } from "@open-decision/design-system";
import { ErrorBoundary } from "react-error-boundary";
import { convertToODError } from "@open-decision/type-classes";
import {
  TNodeRenderer,
  NodeRendererProps,
} from "@open-decision/plugins-node-helpers";
import { SubRenderer } from "./SubRenderer";
import { useMachine } from "@xstate/react";
import {
  createGroupNodeRendererMachine,
  getCurrentIteration,
} from "./groupNodeRenderer.machine";
import { MasterGroupNodeRenderer } from "./MasterGroupNodeRenderer";
import { canGoBackInArray } from "@open-decision/utils";
import { Tree } from "@open-decision/tree-type";

const GroupNode = new GroupNodePlugin();

export const GroupNodeRenderer: TNodeRenderer = (props) => {
  return (
    <ErrorBoundary
      FallbackComponent={({ error }) => (
        <Stack className="h-full" center>
          <ErrorCard error={convertToODError(error)} />
        </Stack>
      )}
    >
      <RendererComponent {...props} />
    </ErrorBoundary>
  );
};

function RendererComponent({ nodeId, ...props }: NodeRendererProps) {
  const { treeClient } = useInterpreter();

  const groupNode = GroupNode.getSingle(nodeId)(treeClient);
  const subTree = React.useMemo(() => {
    return !groupNode ? undefined : createSubTree(clone(groupNode));
  }, [groupNode]);

  if (!groupNode || !subTree) return null;

  return <GroupNodeView groupNode={groupNode} tree={subTree} {...props} />;
}

type Props = {
  groupNode: IGroupNode;
  tree: Tree.TTree;
} & Omit<NodeRendererProps, "nodeId">;

function GroupNodeView({
  groupNode,
  tree,
  nodePlugins,
  edgePlugins,
  ...props
}: Props) {
  const { send, environment, getVariable, treeClient } = useInterpreter();

  const [groupNodeMachine] = React.useState(() => {
    const previousVariable = getVariable(groupNode.id);
    const defaultValue = GroupNode.createDefaultValues(
      groupNode.id,
      previousVariable
    )(treeClient);

    return createGroupNodeRendererMachine({
      iterations: defaultValue,
      position: 0,
    });
  });

  const [groupNodeState, sendToGroupNode] = useMachine(groupNodeMachine);
  const currentIteration = getCurrentIteration(groupNodeState.context);

  const canGoBack = canGoBackInArray(
    groupNodeState.context.iterations,
    groupNodeState.context.position
  );

  if (groupNodeState.matches("idle")) {
    return (
      <MasterGroupNodeRenderer
        groupNode={groupNode}
        onSubmitGroup={(context) => {
          const variable = GroupNode.createVariable(
            groupNode.id,
            groupNodeState.context.iterations
          )(treeClient);

          if (!variable) return;

          send({
            type: "ADD_USER_ANSWER",
            variable,
          });

          send({
            type: "EVALUATE_NODE_CONDITIONS",
            history: context.history.nodes,
          });
        }}
        results={groupNodeState.context.iterations.map(
          (iteration) => iteration.variables
        )}
        onAddIteration={() => {
          sendToGroupNode("START_ITERATION");
        }}
        onGoBack={
          canGoBack
            ? () => {
                sendToGroupNode("GO_BACK");
              }
            : undefined
        }
        onEdit={(index) => {
          sendToGroupNode({ type: "EDIT_ITERATION", position: index });
        }}
        {...props}
      />
    );
  }

  if (groupNodeState.matches("running")) {
    return (
      <Renderer.Root
        environment={environment}
        tree={tree}
        edgePlugins={edgePlugins}
        initialContext={currentIteration}
        onDone={(context) => {
          sendToGroupNode({ type: "FINISH_ITERATION", context });
        }}
        onLeave={() => {
          return sendToGroupNode("LEAVE_ITERATION");
        }}
      >
        <SubRenderer
          edgePlugins={edgePlugins}
          nodePlugins={nodePlugins}
          {...props}
        />
      </Renderer.Root>
    );
  }

  return null;
}
