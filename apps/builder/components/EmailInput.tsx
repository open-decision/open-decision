import { Form, StyleObject } from "@open-decision/design-system";
import { useTranslations } from "next-intl";

type Props = {
  fieldCss?: StyleObject;
  inputCss?: StyleObject;
} & Omit<Form.InputProps, "css">;

export const EmailField = ({ fieldCss, inputCss, ...props }: Props) => {
  const t = useTranslations();

  return (
    <Form.Field css={fieldCss} Label={t("common.emailInput.label")}>
      <Form.Input
        css={inputCss}
        type="email"
        required
        placeholder={t("common.emailInput.placeholder")}
        {...props}
      />
    </Form.Field>
  );
};
