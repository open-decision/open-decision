import * as React from "react";
import {
  baseLinkStyles,
  Button,
  Icon,
  Popover,
  Stack,
  useForm,
  Input,
} from "@open-legal-tech/design-system";
import { RenderElementProps, useSelected, useSlate } from "slate-react";
import { GlobeIcon } from "@radix-ui/react-icons";
import { Element, Transforms } from "slate";
import { Check } from "react-feather";
import * as SlateLink from "../contentTypes/link";

export function Link(props: RenderElementProps) {
  if (props.element.type !== "link")
    throw new Error(
      `This link component can only be used to render the Link Element of the RichTextEditor`
    );

  const isSelected = useSelected();
  const [Form, { register }] = useForm({
    defaultValues: { url: props.element.url },
  });

  const editor = useSlate();
  const [open, setOpen] = React.useState(isSelected);

  React.useEffect(() => setOpen(isSelected), [isSelected]);

  const handleSubmit = React.useCallback(
    ({ url }: { url: string }) => {
      Transforms.setNodes(
        editor,
        { url },
        { match: (n) => Element.isElement(n) && SlateLink.isLinkElement(n) }
      );

      setOpen(false);
    },
    [editor]
  );

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Anchor asChild>
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
      </Popover.Anchor>
      <Popover.Content
        align="start"
        css={{
          display: "flex",
          gap: "$2",
          alignItems: "center",
          "--color": "$colors$gray11",
          padding: "$2",
        }}
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <Form onSubmit={handleSubmit}>
          <Stack css={{ flexDirection: "row", gap: "$1" }}>
            <Icon size="extra-small" label={props.element.url}>
              <GlobeIcon />
            </Icon>
            <Input
              size="small"
              {...register("url")}
              css={{ color: "$colorScheme-text" }}
            />
            <Button square size="extra-small" type="submit" variant="secondary">
              <Icon>
                <Check />
              </Icon>
            </Button>
          </Stack>
        </Form>
      </Popover.Content>
    </Popover.Root>
  );
}
