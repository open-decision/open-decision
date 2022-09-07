import {
  Label,
  styled,
  activeSelector,
  Form,
  VisuallyHidden,
  innerFocusStyle,
} from "@open-decision/design-system";
import * as React from "react";
import { TSelectInput } from "@open-decision/select-input-plugin";

const StyledLabel = styled(Label, {
  border: "1px solid $gray7",
  borderRadius: "$md",
  layer: "1",
  padding: "$3 $4",
  focusType: "inner-within",
  cursor: "pointer",
  fontWeight: "$medium-text",
  boxShadow: "$1",
  focusColor: "$primary5",

  [`${activeSelector}`]: {
    backgroundColor: "$primary3",
    ...innerFocusStyle,
  },
});

type Props = {
  input: TSelectInput;
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
      {hasAnswers
        ? input.answers.map((answer) => (
            <RadioElement
              answer={answer}
              key={answer.id}
              name={name}
              activeValue={activeValue}
            />
          ))
        : null}
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
    <StyledLabel
      size={{ "@desktop": "large" }}
      data-active={activeValue === answer.id}
    >
      <VisuallyHidden>
        <Form.RadioButton required value={answer.id} name={name} />
      </VisuallyHidden>
      {answer.text ? (
        answer.text
      ) : (
        <span style={{ fontStyle: "italic" }}>Kein Antworttext</span>
      )}
    </StyledLabel>
  );
}
