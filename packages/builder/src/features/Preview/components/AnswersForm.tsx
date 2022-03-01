import * as React from "react";
import { BuilderNode, BuilderRelation } from "@open-decision/type-classes";
import {
  useForm,
  RadioButtons,
  useInputGroup,
  Label,
  Tooltip,
  Text,
  styled,
} from "@open-decision/design-system";
import { Interpreter } from "@open-decision/interpreter";
import { Navigation } from "./Navigation";

type PreviewAnswerFormProps = {
  interpreter: Interpreter;
  snapshot: Interpreter;
  node: BuilderNode.TNode;
  relation?: BuilderRelation.TRelation;
};

export function AnswersForm({
  relation,
  interpreter,
  node,
  snapshot,
}: PreviewAnswerFormProps) {
  const defaultValues = {
    relationId: relation?.id ?? "",
  };

  const [Form, { handleSubmit }] = useForm({
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
        onChange={handleSubmit(onSubmit)}
      >
        {Object.values(node.relations).map((relation) => (
          <AnswersRadioButtons relation={relation} key={relation.id} />
        ))}
      </RadioButtons.Group>
      <Navigation interpreter={interpreter} snapshot={snapshot} />
    </Form>
  );
}

const StyledTooltipTrigger = styled(Tooltip.Trigger, {
  justifyContent: "start",
  gap: "$3",
  padding: "$3",
  border: "1px solid $colors$gray6",
  color: "$black",
  borderRadius: "$md",
  transition: "background-color 100ms ease-in",
  backgroundColor: "$white",

  variants: {
    status: {
      active: {
        backgroundColor: "$primary9",
        color: "$white",
        fontWeight: "500 !important",
      },
      disabled: {
        opacity: 0.5,
        color: "$gray10",

        "&[data-answer='true']": {
          color: "$black",
        },
      },
      default: {
        "&:hover": {
          backgroundColor: "$primary4",
        },
      },
    },
  },

  defaultVariants: {
    status: "default",
  },
});

type status = "disabled" | "active" | "default";

type PreviewRadioButtonsProps = { relation: BuilderRelation.TRelation };

function AnswersRadioButtons({ relation }: PreviewRadioButtonsProps) {
  const [isTooltipOpen, setIsTooltipOpen] = React.useState(false);

  const { getActive } = useInputGroup("radio");
  const hasAnswer = relation?.answer != null;

  let status: status = "default";

  if (getActive?.(relation.id)) status = "active";
  if (relation?.target == null) status = "disabled";

  return (
    <>
      <Tooltip.Root
        open={isTooltipOpen}
        onOpenChange={(open) =>
          setIsTooltipOpen(status !== "disabled" ? false : open)
        }
      >
        <RadioButtons.Button
          id={relation.id}
          value={relation.id}
          css={{ position: "absolute", width: 0, height: 0 }}
          disabled={status === "disabled"}
        />
        <StyledTooltipTrigger asChild status={status} data-answer={hasAnswer}>
          <Label htmlFor={relation.id} css={{ textStyle: "medium-text" }}>
            {hasAnswer ? relation.answer : "Kein Antworttext"}
          </Label>
        </StyledTooltipTrigger>
        <Tooltip.Content sideOffset={10} side="right">
          <Text>Diese Antwort hat kein Ziel.</Text>
        </Tooltip.Content>
      </Tooltip.Root>
    </>
  );
}
