import { Form } from "@open-decision/design-system";
import { useTranslations } from "next-intl";
import * as React from "react";
import { TAnswer } from "../../types/answer";
import { labelContainerClasses } from "./container";

type ElementProps = {
  answer: TAnswer;
  name: string;
} & Form.CheckboxProps;

export const CheckboxElement = React.forwardRef<HTMLInputElement, ElementProps>(
  ({ answer, ...props }, ref) => {
    const t = useTranslations("renderer.preview");

    return (
      <label className={labelContainerClasses}>
        <Form.Checkbox {...props} ref={ref} />
        {answer.value ? (
          answer.value
        ) : (
          <span style={{ fontStyle: "italic" }}>{t("missingText")}</span>
        )}
      </label>
    );
  }
);
