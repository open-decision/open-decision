import * as React from "react";
import { Form, Stack } from "@open-decision/design-system";
import { useTreeClient } from "@open-decision/tree-sync";
import { updateLabel } from "./updateLabel";
import { updateRequired } from "./updateRequired";
import { useFormContext } from "react-hook-form";

type Props = {
  inputId: string;
  className?: string;
};

export const InputConfig = ({ inputId, className }: Props) => {
  const treeClient = useTreeClient();

  const onChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      updateLabel(treeClient)(inputId, event.target.value);
    },
    [inputId, treeClient]
  );

  const { register } = useFormContext();

  return (
    <Stack className={`gap-2 ${className}`}>
      <Form.Field Label="Label">
        <Form.Input {...register("label", { onChange })} />
      </Form.Field>
      <Form.Field
        Label="Nutzereingabe erforderlich?"
        layout="constrained-right"
      >
        <Form.Checkbox
          name="required"
          className="max-w-max"
          onChange={(event) => {
            updateRequired(treeClient)(inputId, event.target.checked);
          }}
        />
      </Form.Field>
    </Stack>
  );
};
