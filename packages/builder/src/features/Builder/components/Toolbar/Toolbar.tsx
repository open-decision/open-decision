import {
  Button,
  ButtonProps,
  Icon,
  Row,
  styled,
  StyleObject,
} from "@open-decision/design-system";
import { Separator } from "components/Separator";
import { useStartNode } from "features/Builder/state/treeStore/hooks";
import { useTreeContext } from "features/Builder/state/treeStore/TreeContext";
import { useEditor } from "features/Builder/state/useEditor";
import {
  ArrowLeft,
  ArrowRight,
  PlusCircle,
  Star,
  ZoomIn,
  ZoomOut,
} from "react-feather";
import { useReactFlow } from "react-flow-renderer";
import { NodeSearch } from "../NodeSearch";

const Container = styled(Row, {
  layer: "1",
  padding: "$2 $4",
  borderRadius: "$xl",
  alignItems: "center",
  height: "max-content",
  width: "max-content",
});

const ToolbarSeparator = () => (
  <Row css={{ width: "24px", marginInline: "$2", justifyContent: "center" }}>
    <Separator
      orientation="vertical"
      decorative
      css={{
        height: "18px",
        width: "2px !important",
        borderRadius: "$full",
      }}
    />
  </Row>
);

const buttonProps: ButtonProps = {
  variant: "neutral",
  square: true,
};

type Props = { css?: StyleObject };

export function Toolbar({ css }: Props) {
  const { zoomIn, zoomOut } = useReactFlow();
  const { getCenter, zoomToNode, addSelectedNodes } = useEditor();
  const {
    createNode,
    addNode,
    createInput,
    createAnswer,
    addInputAnswer,
    addInput,
  } = useTreeContext();

  return (
    <Container css={css}>
      {/* FIXME undo/redo needs to be reenabled to enable the next two buttons */}
      <Button {...buttonProps} disabled>
        <Icon>
          <ArrowLeft />
        </Icon>
      </Button>
      <Button {...buttonProps} disabled>
        <Icon>
          <ArrowRight />
        </Icon>
      </Button>
      <ToolbarSeparator />
      <Button {...buttonProps} onClick={() => zoomIn({ duration: 200 })}>
        <Icon>
          <ZoomIn />
        </Icon>
      </Button>
      <Button {...buttonProps} onClick={() => zoomOut({ duration: 200 })}>
        <Icon>
          <ZoomOut />
        </Icon>
      </Button>
      <ToolbarSeparator />
      <Button
        {...buttonProps}
        onClick={() => {
          const newInput = createInput();
          const newAnswer = createAnswer({ text: "" });

          const newNode = createNode({
            data: { inputs: [newInput.id], conditions: [] },
            position: getCenter(),
          });

          addNode(newNode);
          addInput(newInput);
          addInputAnswer(newInput.id, newAnswer);

          addSelectedNodes([newNode.id]);
          zoomToNode(newNode);
        }}
      >
        <Icon>
          <PlusCircle />
        </Icon>
      </Button>
      <ToolbarSeparator />
      <GoToStartnodeButton />
      <ToolbarSeparator />
      <NodeSearch />
    </Container>
  );
}

function GoToStartnodeButton() {
  const { zoomToNode, addSelectedNodes } = useEditor();
  const startNode = useStartNode();

  return (
    <Button
      {...buttonProps}
      onClick={() => {
        if (!startNode) return;
        addSelectedNodes([startNode.id]);
        zoomToNode(startNode);
      }}
      disabled={!startNode}
    >
      <Icon>
        <Star />
      </Icon>
    </Button>
  );
}
