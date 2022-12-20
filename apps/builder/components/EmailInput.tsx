import { Form } from "@open-decision/design-system";
import { useTranslations } from "next-intl";

type Props = {
  className?: string;
  inputClassName?: string;
  required?: boolean;
} & Partial<Form.InputProps>;

export const EmailField = ({
  className,
  inputClassName,
  required = true,
  ...props
}: Props) => {
  const t = useTranslations();

  const { register } = Form.useFormContext();

  return (
    <Form.Field className={className} Label={t("common.emailInput.label")}>
      <Form.Input
        {...register("email", {
          required: {
            value: required,
            message: "Bitte gib eine E-Mail Adresse an.",
          },
        })}
        className={inputClassName}
        type="email"
        placeholder={t("common.emailInput.placeholder")}
        {...props}
      />
    </Form.Field>
  );
};
