import {
  Label,
  styled,
  RadioButton,
  activeSelector,
  intentWithinSelector,
  Form,
  VisuallyHidden,
} from "@open-decision/design-system";
import { Input } from "@open-decision/type-classes";
import { InfoBox } from "features/Notifications/InfoBox";
import React from "react";

const StyledLabel = styled(Label, {
  border: "1px solid $gray7",
  borderRadius: "$md",
  layer: "1",
  padding: "$3 $4",
  focusType: "inner-within",
  cursor: "pointer",

  [`${intentWithinSelector}`]: {
    backgroundColor: "$primary3",
  },

  [`${activeSelector}`]: {
    backgroundColor: "$primary9",
    color: "$white",
  },
});

type Props = {
  input: Input.TInput;
  name: string;
  activeValue: string;
};

export const Answers = React.forwardRef<HTMLDivElement, Props>(function Answers(
  { input, name, activeValue },
  ref
) {
  const hasAnswers = input.answers.length > 0;

  return (
    <Form.RadioGroup ref={ref} css={{ gap: "$1" }}>
      {hasAnswers ? (
        input.answers.map((answer) => (
          <RadioElement
            answer={answer}
            key={answer.id}
            name={name}
            activeValue={activeValue}
          />
        ))
      ) : (
        <InfoBox
          content="Diese Frage enthält keine Antwortmöglichkeiten"
          title="Fehlende Daten"
          variant="info"
          css={{ boxShadow: "$1" }}
        />
      )}
    </Form.RadioGroup>
  );
});

type SelectElementProps = {
  answer: {
    text: string;
    id: string;
  };
  name: string;
  activeValue: string;
};

function RadioElement({ answer, name, activeValue }: SelectElementProps) {
  return (
    <StyledLabel size="large" data-active={activeValue === answer.id}>
      <VisuallyHidden>
        <Form.RadioButton required value={answer.id} name={name} />
      </VisuallyHidden>
      {answer.text ? answer.text : "Kein Antworttext"}
    </StyledLabel>
  );
}
