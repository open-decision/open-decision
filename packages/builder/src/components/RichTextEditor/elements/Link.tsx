import * as React from "react";
import {
  baseLinkStyles,
  Icon,
  Text,
  Tooltip,
} from "@open-legal-tech/design-system";
import { RenderElementProps } from "slate-react";
import { GlobeIcon } from "@radix-ui/react-icons";

export function Link(props: RenderElementProps) {
  if (props.element.type !== "link")
    throw new Error(
      `This link component can only be used to render the Link Element of the RichTextEditor`
    );

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <a
          className={baseLinkStyles({
            size: "small",
            css: { display: "inline-flex", fontSize: "inherit" },
          })}
          href={props.element.url}
          {...props.attributes}
        >
          {props.children}
        </a>
      </Tooltip.Trigger>
      <Tooltip.Content
        css={{
          display: "flex",
          gap: "$1",
          alignItems: "center",
          "--color": "$colors$gray11",
        }}
      >
        <Icon size="extra-small" label={props.element.url}>
          <GlobeIcon />
        </Icon>
        <Text size="extra-small">{props.element.url}</Text>
      </Tooltip.Content>
    </Tooltip.Root>
  );
}
