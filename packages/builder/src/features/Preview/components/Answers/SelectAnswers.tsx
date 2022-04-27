import {
  activeStyle,
  intentStyleWithin,
  Label,
  RadioButtons,
  RadioGroupProps,
  styled,
  useInputGroup,
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

  ...intentStyleWithin({
    backgroundColor: "$primary3",
  }),

  ...activeStyle({
    backgroundColor: "$primary9",
    color: "$white",
  }),
});

type Props = {
  input: Input.TInput;
  onChange?: RadioGroupProps["onChange"];
  name: string;
};

export function SelectAnswers({ input, onChange, name }: Props) {
  const hasAnswers = input.answers.length > 0;

  return (
    <RadioButtons.Group
      name={name}
      css={{
        gap: "$1",
        display: "grid",
      }}
      onChange={onChange}
      key={input.id}
    >
      {hasAnswers ? (
        input.answers.map((answer) => (
          <SelectElement answer={answer} key={answer.id} />
        ))
      ) : (
        <InfoBox
          content="Diese Frage enthält keine Antwortmöglichkeiten"
          title="Fehlende Daten"
          variant="info"
          css={{ boxShadow: "$1" }}
        />
      )}
    </RadioButtons.Group>
  );
}

type SelectElementProps = {
  answer: {
    text: string;
    id: string;
  };
};

function SelectElement({ answer }: SelectElementProps) {
  const { getActive } = useInputGroup("radio");

  return (
    <StyledLabel
      htmlFor={answer.id}
      size="large"
      data-active={getActive?.(answer.id)}
    >
      <RadioButtons.Button
        id={answer.id}
        value={answer.id}
        css={{ position: "absolute", width: 0, height: 0 }}
      />
      {answer.text ? answer.text : "Kein Antworttext"}
    </StyledLabel>
  );
}
