import * as React from "react";
import { VisuallyHidden } from "ariakit";
import { Form } from "..";
import { rowClasses, stackClasses } from "../../Layout";
import { badgeClasses } from "../../Badge/Badge";

export type FieldProps = {
  children: JSX.Element;
  className?: string;
  name?: string;
  Label: React.ReactNode;
  layout?:
    | "block"
    | "inline-left"
    | "inline-right"
    | "no-label"
    | "constrained-left"
    | "constrained-right";
  required?: boolean;
  style?: React.CSSProperties;
};

export function Field({
  Label,
  children,
  className,
  layout = "block",
  name: optionalName,
  required: optionalRequired,
  style,
}: FieldProps) {
  if (!React.Children.only(children)) {
    throw new Error(
      "The Field component can only ever wrap one Input as a child."
    );
  }

  const name = optionalName ? optionalName : children.props.name;
  const required = optionalRequired
    ? optionalRequired
    : children.props.required;

  if (!name)
    throw new Error(`The Field component or its input child needs a name.`);

  const isLabelHidden = layout === "no-label";

  const WrappedLabel =
    typeof Label === "string" ? (
      <Form.Label className="grid gap-2 field flex-1" data-layout={layout}>
        <span
          className={rowClasses({}, ["gap-2"])}
          style={{
            gridArea: "label",
            wordBreak: typeof Label === "string" ? "break-word" : undefined,
          }}
        >
          {Label}
          {required ? (
            <span
              className={badgeClasses({ size: "small" }, ["colorScheme-gray"])}
            >
              *Pflichtfeld
            </span>
          ) : null}
        </span>
        <span style={{ gridArea: "input" }}>{children}</span>
      </Form.Label>
    ) : (
      <Form.Label className="grid gap-2 field flex-1" data-layout={layout}>
        {Label}
        <span style={{ gridArea: "input" }}>{children}</span>
      </Form.Label>
    );

  return (
    <div className={stackClasses({}, [className])} style={style}>
      {isLabelHidden ? (
        <>
          <VisuallyHidden>
            <Form.Label>{Label}</Form.Label>
          </VisuallyHidden>
          <span style={{ gridArea: "input" }}>{children}</span>
        </>
      ) : (
        WrappedLabel
      )}
      <Form.Error
        data-test={`error-${name}`}
        name={name}
        className="mt-2"
        style={{ gridArea: "error" }}
      />
    </div>
  );
}
