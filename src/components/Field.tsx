import React from "react";
import { StitchesExtractVariantsStyles } from "@stitches/core";
import { styled } from "utils/stitches.config";
import { Input } from "./Input";

const Container = styled("div", {
  display: "grid",
  gap: "$2",

  variants: {
    layout: {
      block: {
        gridTemplateColumns: "1fr",
      },
      inline: {
        alignItems: "center",
      },
    },
  },
});

const Label = styled("label", {
  color: "$gray700",
  fontWeight: "$semibold",
  minWidth: "max-content",
});

export type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  layout?: keyof StitchesExtractVariantsStyles<typeof Container>["layout"];
};

/**
 * A Field combines an Input with a label and takes care of accessibility requirements.
 * The layout variant determines the layout of the label in relation to the input.
 */
export const Field: React.FC<FieldProps> = ({
  name,
  label,
  layout,
  ...props
}) => {
  return (
    <Container layout={layout}>
      <Label htmlFor={name}>{label}</Label>
      <Input {...props} />
    </Container>
  );
};
