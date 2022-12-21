import * as React from "react";
import { InterpreterContext } from "@open-decision/interpreter";
import {
  useInterpreter,
  useInterpreterTree,
} from "@open-decision/interpreter-react";
import { EdgePluginObject } from "@open-decision/plugins-edge-helpers";
import {
  RendererNodePluginObject,
  Renderer,
  RendererPrimitives,
  NodeRendererProps,
} from "@open-decision/renderer";
import { RichTextRenderer } from "@open-decision/rich-text-editor";
import { clone } from "remeda";
import { GroupNodePlugin } from "./groupNodePlugin";
import { createSubTree } from "./utils/createSubtree";
import {
  Button,
  Form,
  Heading,
  Icon,
  Row,
  stackClasses,
  textClasses,
} from "@open-decision/design-system";
import { PlusIcon } from "@radix-ui/react-icons";

const GroupNode = new GroupNodePlugin();

export function createGroupNodeRenderer(
  edgePlugins: Record<string, EdgePluginObject>,
  nodePlugins: Record<string, RendererNodePluginObject>
) {
  function RendererComponent({ nodeId, ...props }: NodeRendererProps) {
    const { treeClient, send, environment } = useInterpreter();
    const groupNode = GroupNode.get.single(nodeId)(treeClient);

    const subTree = React.useMemo(
      () =>
        groupNode instanceof Error
          ? undefined
          : createSubTree(clone(groupNode)),
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
              send({
                type: "ADD_USER_ANSWER",
                answer: {
                  [groupNode.id]: {
                    type: "group",
                    answers: iterationResults.map((result) => result.answers),
                  },
                },
              });
              send({ type: "EVALUATE_NODE_CONDITIONS" });
            }}
            iterationResults={iterationResults}
            nodePlugins={nodePlugins}
            groupNodeId={nodeId}
          />
        </Renderer.Root>
      </RendererPrimitives.Container>
    );
  }

  return RendererComponent;
}

type Props = {
  nodePlugins: Record<string, RendererNodePluginObject>;
  groupNodeId: string;
  iterationResults: InterpreterContext[];
  onDone: () => void;
  className?: string;
};

const RendererContent = ({
  nodePlugins,
  groupNodeId,
  iterationResults,
  onDone,
  className,
}: Props) => {
  const { getCurrentNode, state, send } = useInterpreter();
  const groupNode = useInterpreterTree(GroupNode.get.single(groupNodeId));

  const methods = Form.useForm();

  if (groupNode instanceof Error) return null;

  if (state.matches("done"))
    return (
      <RendererPrimitives.Form
        methods={methods}
        onSubmit={methods.handleSubmit(onDone)}
      >
        <RendererPrimitives.ContentArea>
          {groupNode.data.content ? (
            <RichTextRenderer
              content={groupNode.data.content}
              className="px-0"
            />
          ) : null}
        </RendererPrimitives.ContentArea>
        <Heading size="small" as="h3">
          Bisherige Antworten
        </Heading>
        <ol className={stackClasses({}, ["gap-4 mb-4"])}>
          {iterationResults.map((_, index) => (
            <li className={textClasses({ size: "large" })} key={index}>
              {groupNode.data.title ?? "Ausfüllung"}
            </li>
          ))}
        </ol>
        <ButtonRow
          onClick={() => {
            send({ type: "RESTART" });
            send({ type: "EVALUATE_NODE_CONDITIONS" });
          }}
          groupNodeId={groupNodeId}
        />
      </RendererPrimitives.Form>
    );

  const currentNode = getCurrentNode();
  if (currentNode.id === groupNodeId)
    return (
      <RendererPrimitives.Form methods={methods}>
        <RendererPrimitives.ContentArea>
          {groupNode.data.content ? (
            <RichTextRenderer
              content={groupNode.data.content}
              className="px-0"
            />
          ) : null}
        </RendererPrimitives.ContentArea>
        <ButtonRow
          onClick={() => {
            send({ type: "EVALUATE_NODE_CONDITIONS" });
          }}
          groupNodeId={groupNodeId}
        />
      </RendererPrimitives.Form>
    );

  return (
    <Renderer.View
      nodePlugins={nodePlugins}
      withNavigation={false}
      className={`p-0 ${className}`}
    />
  );
};

type ButtonRowProps = {
  onClick: () => void;
  groupNodeId: string;
};

const ButtonRow = ({ onClick, groupNodeId }: ButtonRowProps) => {
  const groupNode = useInterpreterTree(GroupNode.get.single(groupNodeId));

  if (groupNode instanceof Error) return null;

  return (
    <Row className="gap-2 justify-end">
      <Button className="max-w-max" onClick={onClick} variant="tertiary">
        <Icon>
          <PlusIcon />
        </Icon>
        {`${groupNode.data.cta ?? "Antwort"} hinzufügen`}
      </Button>
    </Row>
  );
};
