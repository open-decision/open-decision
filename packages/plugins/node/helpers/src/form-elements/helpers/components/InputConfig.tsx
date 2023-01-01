import * as React from "react";
import { Stack, Form } from "@open-decision/design-system";
import { useTreeClient } from "@open-decision/tree-sync";
import { InputComponentProps } from "../types";
import { updateLabel } from "./updateLabel";
import { updateRequired } from "./updateRequired";

type Props = InputComponentProps;

export function InputConfig({ inputId, withRequiredOption = true }: Props) {
  const treeClient = useTreeClient();

  const onLabelChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      updateLabel(treeClient)(inputId, event.target.value);
    },
    [inputId, treeClient]
  );

  const onRequiredChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      updateRequired(treeClient)(inputId, event.target.checked);
    },
    [inputId, treeClient]
  );

  const { register } = Form.useFormContext();

  return (
    <Stack className="gap-2">
      <Form.Field Label="Label (optional)">
        <Form.Input {...register("label", { onChange: onLabelChange })} />
      </Form.Field>
      {withRequiredOption ? (
        <Form.Field
          Label="Nutzereingabe erforderlich?"
          layout="constrained-right"
        >
          <Form.Checkbox
            className="max-w-max"
            {...register("required", {
              onChange: onRequiredChange,
            })}
            value="required"
          />
        </Form.Field>
      ) : null}
    </Stack>
  );
}
