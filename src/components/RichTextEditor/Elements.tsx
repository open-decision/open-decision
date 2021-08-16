import { Heading, Text } from "@open-legal-tech/design-system";
import { RenderElementProps } from "slate-react";

const DefaultElement = (props: RenderElementProps) => {
  return <Text {...props.attributes}>{props.children}</Text>;
};

export const renderElement = (props: RenderElementProps): JSX.Element => {
  switch (props.element.type) {
    case "h1":
      return <Heading size="lg" {...props} />;
    case "h2":
      return <Heading size="md" {...props} />;
    case "h3":
      return <Heading size="xs" {...props} />;
    default:
      return <DefaultElement {...props} />;
  }
};
