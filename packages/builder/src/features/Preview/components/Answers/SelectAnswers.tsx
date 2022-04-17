import {
  activeStyle,
  intentStyleWithin,
  Label,
  RadioButtons,
  RadioGroupProps,
  styled,
  Text,
} from "@open-decision/design-system";
import { Input } from "@open-decision/type-classes";
import { InfoBox } from "features/Notifications/InfoBox";
import { Notification } from "features/Notifications/Notification";
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

type Props = { input: Input.TInput; onChange?: RadioGroupProps["onChange"] };

export function SelectAnswers({ input, onChange }: Props) {
  const hasAnswers = input.answers.length > 0;

  return (
    <RadioButtons.Group
      name="relationId"
      css={{
        marginBottom: "$8",
        gap: "$1",
        display: "grid",
      }}
      onChange={onChange}
      key={input.id}
    >
      {hasAnswers ? (
        input.answers.map((answer) => (
          <StyledLabel htmlFor={answer.id} size="large" key={answer.id}>
            <RadioButtons.Button
              id={answer.id}
              value={answer.id}
              css={{ position: "absolute", width: 0, height: 0 }}
            />
            {answer.text ? answer.text : "Kein Antworttext"}
          </StyledLabel>
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
