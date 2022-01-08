import {
  Box,
  Button,
  Icon,
  styled,
  RadioButtons,
  useForm,
  useWatch,
  Label,
  useInputGroup,
} from "@open-legal-tech/design-system";
import * as React from "react";
import { RichTextEditor } from "components";
import { useTree } from "features/Builder/state/useTree";
import { Interpreter, useInterpreter } from "@open-decision/interpreter";
import { renderElement } from "./shared";
import { ArrowLeft, ArrowRight } from "react-feather";
import { Separator } from "@radix-ui/react-separator";
import { BuilderNode, BuilderRelation } from "@open-decision/type-classes";

const StyledButton = styled(Button, {
  "&:hover": {
    backgroundColor: "$gray3",
  },
});

const StyledSeparator = styled(Separator, {
  width: "1px",
  background: "$gray7",
  marginInline: "$1",
});

export function Preview() {
  const [snapshot, interpreter] = useInterpreter();
  const [node, send] = useTree((state) => state.nodes[interpreter.currentNode]);
  const relation = React.useMemo(
    () => snapshot.getAnswer(node.id),
    [node.id, snapshot]
  );

  return (
    <Box
      css={{
        display: "grid",
        gridTemplateColumns: "1fr 2fr 1fr",
        height: "100%",
        backgroundColor: "$gray2",
      }}
    >
      <Box css={{ gridColumn: "2" }}>
        <RichTextEditor.Root
          key={snapshot.currentNode}
          value={node.content}
          setValue={(newValue) =>
            send({
              type: "updateNode",
              id: snapshot.currentNode,
              node: { content: newValue },
            })
          }
        >
          <PreviewRichTextEditor />
        </RichTextEditor.Root>
        <PreviewAnswersForm
          relation={relation}
          node={node}
          interpreter={interpreter}
          snapshot={snapshot}
          key={`form_${node.id}`}
        />
      </Box>
    </Box>
  );
}

function PreviewRichTextEditor() {
  return (
    <Box
      css={{
        marginBlock: "$8",
        overflow: "hidden",
        maxHeight: "800px",
      }}
    >
      <RichTextEditor.Editable
        css={{
          gridRow: "2",
          paddingInlineEnd: "$8",
          minHeight: 0,
        }}
        readOnly
        renderElement={renderElement}
        placeholder="Dieser Knoten hat keinen Inhalt"
      />
    </Box>
  );
}

type PreviewNavigationProps = {
  interpreter: Interpreter;
  snapshot: Interpreter;
};

function PreviewNavigation({ interpreter, snapshot }: PreviewNavigationProps) {
  const answer = useWatch({ name: "relationId" });

  return (
    <Box css={{ display: "flex", justifyContent: "center" }}>
      <StyledButton
        variant="ghost"
        onClick={() => interpreter.goBack()}
        disabled={!snapshot.hasHistory}
        css={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
      >
        <Icon label="Zurück">
          <ArrowLeft />
        </Icon>
        Zurück
      </StyledButton>
      <StyledSeparator orientation="vertical" />
      <StyledButton
        variant="ghost"
        css={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
        type="submit"
        disabled={!answer}
      >
        Weiter
        <Icon label="Weiter">
          <ArrowRight />
        </Icon>
      </StyledButton>
    </Box>
  );
}

type PreviewAnswerFormProps = {
  interpreter: Interpreter;
  snapshot: Interpreter;
  node: BuilderNode.TNode;
  relation?: BuilderRelation.TRelation;
};

function PreviewAnswersForm({
  relation,
  interpreter,
  node,
  snapshot,
}: PreviewAnswerFormProps) {
  const defaultValues = {
    relationId: relation?.id ?? "",
  };

  const [Form] = useForm({
    defaultValues,
  });

  const onSubmit = (data: typeof defaultValues) => {
    const relation = interpreter.getRelationById(node.id, data.relationId);

    return relation ? interpreter.evaluateUserInput(relation) : null;
  };

  return (
    <Form onSubmit={onSubmit}>
      <RadioButtons.Group
        name="relationId"
        css={{
          marginBottom: "$8",
          gap: "$2",
          display: "grid",
        }}
      >
        {Object.values(node.relations).map((relation) => (
          <React.Fragment key={relation.id}>
            <PreviewAnswersRadioButtons relation={relation} />
          </React.Fragment>
        ))}
      </RadioButtons.Group>
      <PreviewNavigation interpreter={interpreter} snapshot={snapshot} />
    </Form>
  );
}

type PreviewRadioButtonsProps = { relation: BuilderRelation.TRelation };

function PreviewAnswersRadioButtons({ relation }: PreviewRadioButtonsProps) {
  const { getActive } = useInputGroup("radio");
  const isActive = relation ? getActive?.(relation.id) : false;

  return (
    <>
      <RadioButtons.Button
        id={relation.id}
        value={relation.id}
        css={{ position: "absolute", width: 0, height: 0 }}
      />
      <Label
        htmlFor={relation.id}
        css={{
          justifyContent: "start",
          gap: "$3",
          padding: "$3",
          border: "1px solid $colors$gray6",
          backgroundColor: isActive ? "$primary3" : "$white",
          color: "$black",
          borderRadius: "$md",
        }}
      >
        {relation.answer ?? (
          <Box css={{ color: "$gray10" }}>Kein Antworttext</Box>
        )}
      </Label>
    </>
  );
}
