import { Form } from "@open-decision/design-system";
import { useTranslations } from "next-intl";
import * as React from "react";
import { TAnswer } from "../../types/answer";
import { labelContainerClasses } from "./container";

type Props = {
  answers: TAnswer[];
  name: string;
  activeValue: string;
  required: boolean;
};

export const RendererRadioGroup = React.forwardRef<HTMLDivElement, Props>(
  function Answers({ answers, name, activeValue, required }, ref) {
    const t = useTranslations("renderer.preview");

    const { register } = Form.useFormContext();

    return (
      <Form.Radio.Group ref={ref} className="gap-1">
        {answers.map((answer) => (
          <label
            key={answer.id}
            className={labelContainerClasses}
            data-active={activeValue === answer.id}
          >
            <Form.Radio.Item
              {...register(name, { required })}
              value={answer.id}
            />
            {answer.value ? (
              answer.value
            ) : (
              <span style={{ fontStyle: "italic" }}>{t("missingText")}</span>
            )}
          </label>
        ))}
      </Form.Radio.Group>
    );
  }
);
