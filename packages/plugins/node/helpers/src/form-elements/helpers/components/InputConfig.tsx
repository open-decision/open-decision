import { Stack, Form } from "@open-decision/design-system";
import { InputComponentProps } from "../types";

type Props = InputComponentProps & {
  onLabelChange: (newLabel: string) => void;
  onRequiredChange: (newValue: boolean) => void;
};

export function InputConfig({
  withRequiredOption = true,
  onLabelChange,
  onRequiredChange,
}: Props) {
  const { register } = Form.useFormContext();

  return (
    <Stack className="gap-2">
      <Form.Field Label="Label (optional)">
        <Form.Input
          {...register("label", {
            onChange: (event) => onLabelChange(event.target.value),
          })}
        />
      </Form.Field>
      {withRequiredOption ? (
        <Form.Field
          Label="Nutzereingabe erforderlich?"
          layout="constrained-right"
        >
          <Form.Checkbox
            className="max-w-max"
            {...register("required", {
              onChange: (event) => onRequiredChange(event.target.checked),
            })}
            value="required"
          />
        </Form.Field>
      ) : null}
    </Stack>
  );
}
