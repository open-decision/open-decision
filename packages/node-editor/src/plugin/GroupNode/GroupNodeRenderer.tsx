import * as React from "react";
import { InterpreterContext } from "@open-decision/interpreter";
import {
  useInterpreter,
  useInterpreterTree,
} from "@open-decision/interpreter-react";
import { Renderer, RendererPrimitives } from "@open-decision/renderer";
import { RichTextRenderer } from "@open-decision/rich-text-editor";
import { clone } from "remeda";
import { GroupNodePlugin } from "./GroupNodePlugin";
import { createSubTree } from "./utils/createSubtree";
import {
  Button,
  ErrorCard,
  Form,
  Heading,
  Icon,
  Row,
  Stack,
  stackClasses,
  textClasses,
} from "@open-decision/design-system";
import { PlusIcon } from "@radix-ui/react-icons";
import { ErrorBoundary } from "react-error-boundary";
import { convertToODError } from "@open-decision/type-classes";
import {
  TNodeRenderer,
  NodeRendererProps,
} from "@open-decision/plugins-node-helpers";
import { TNodeId } from "@open-decision/tree-type";

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

function RendererComponent({
  nodeId,
  nodePlugins,
  edgePlugins,
  ...props
}: NodeRendererProps) {
  const { treeClient, send, environment } = useInterpreter();
  const groupNode = GroupNode.getSingle(nodeId)(treeClient);

  const subTree = React.useMemo(
    () => (!groupNode ? undefined : createSubTree(clone(groupNode))),
    [groupNode]
  );

  const [iterationResults, setIterationsResults] = React.useState<
    InterpreterContext[]
  >([]);

  if (groupNode instanceof Error || !subTree) return null;

  return (
    <RendererPrimitives.Container nodeId={nodeId} {...props}>
      <Renderer.Root
        environment={environment}
        tree={subTree}
        onDone={(context) => {
          return setIterationsResults((oldState) => [...oldState, context]);
        }}
        edgePlugins={edgePlugins}
      >
        <RendererContent
          onDone={() => {
            const variable = GroupNode.createVariable(
              nodeId,
              iterationResults.map((result) => result.variables)
            )(treeClient);

            if (!variable) return;

            send({
              type: "ADD_USER_ANSWER",
              variable,
            });
            send({ type: "EVALUATE_NODE_CONDITIONS" });
          }}
          iterationResults={iterationResults}
          nodePlugins={nodePlugins}
          edgePlugins={edgePlugins}
          groupNodeId={nodeId}
          GroupNode={GroupNode}
        />
      </Renderer.Root>
    </RendererPrimitives.Container>
  );
}

type RendererContentProps = {
  groupNodeId: TNodeId;
  iterationResults: InterpreterContext[];
  onDone: () => void;
  className?: string;
  GroupNode: GroupNodePlugin;
} & Pick<NodeRendererProps, "edgePlugins" | "nodePlugins">;

const RendererContent = ({
  GroupNode,
  edgePlugins,
  groupNodeId,
  iterationResults,
  onDone,
  className,
  nodePlugins,
}: RendererContentProps) => {
  const { getCurrentNode, state, send } = useInterpreter();
  const groupNode = useInterpreterTree(GroupNode.getSingle(groupNodeId));

  const methods = Form.useForm();

  if (!groupNode) return null;

  if (state.matches("done"))
    return (
      <RendererPrimitives.Form
        methods={methods}
        onSubmit={methods.handleSubmit(onDone)}
      >
        <RendererPrimitives.ContentArea>
          {groupNode.content ? (
            <RichTextRenderer content={groupNode.content} className="px-0" />
          ) : null}
        </RendererPrimitives.ContentArea>
        <Heading size="small" as="h3">
          Bisherige Antworten
        </Heading>
        <ol className={stackClasses({}, ["gap-4 mb-4"])}>
          {iterationResults.map((_, index) => (
            <li className={textClasses({ size: "large" })} key={index}>
              {groupNode.title ?? "Ausfüllung"}
            </li>
          ))}
        </ol>
        <ButtonRow
          onClick={() => {
            send({ type: "RESTART" });
            send({ type: "EVALUATE_NODE_CONDITIONS" });
          }}
          groupNodeId={groupNodeId}
          GroupNode={GroupNode}
        />
      </RendererPrimitives.Form>
    );

  const currentNode = getCurrentNode();

  if (currentNode instanceof Error) return null;

  if (currentNode.id === groupNodeId)
    return (
      <RendererPrimitives.Form methods={methods}>
        <RendererPrimitives.ContentArea>
          {groupNode.content ? (
            <RichTextRenderer content={groupNode.content} className="px-0" />
          ) : null}
        </RendererPrimitives.ContentArea>
        <ButtonRow
          onClick={() => {
            send({ type: "EVALUATE_NODE_CONDITIONS" });
          }}
          groupNodeId={groupNodeId}
          GroupNode={GroupNode}
        />
      </RendererPrimitives.Form>
    );

  return (
    <Renderer.View
      nodePlugins={nodePlugins}
      edgePlugins={edgePlugins}
      withNavigation={false}
      className={`p-0 ${className}`}
    />
  );
};

type ButtonRowProps = {
  onClick: () => void;
  groupNodeId: TNodeId;
  GroupNode: GroupNodePlugin;
};

const ButtonRow = ({ onClick, GroupNode, groupNodeId }: ButtonRowProps) => {
  const groupNode = useInterpreterTree(GroupNode.getSingle(groupNodeId));

  if (groupNode instanceof Error) return null;

  return (
    <Row className="gap-2 justify-end">
      <Button className="max-w-max" onClick={onClick} variant="tertiary">
        <Icon>
          <PlusIcon />
        </Icon>
        {`${groupNode?.cta ?? "Antwort"} hinzufügen`}
      </Button>
    </Row>
  );
};
