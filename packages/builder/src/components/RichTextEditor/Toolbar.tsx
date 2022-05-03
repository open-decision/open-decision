import {
  Box,
  Icon,
  styled,
  ToggleButton,
  Button,
  hoverStyle,
} from "@open-decision/design-system";
import * as React from "react";
import {
  FontBoldIcon,
  FontItalicIcon,
  HeadingIcon,
  Link2Icon,
  ListBulletIcon,
  TextIcon,
  UnderlineIcon,
} from "@radix-ui/react-icons";
import { Editor } from "@tiptap/react";
import { NumberedList } from "./NumberedListIcon";
import { Separator } from "components/Separator";

const StyledToolbar = styled(Box, {
  display: "flex",
  alignItems: "center",
  padding: "$2 $1",
  boxShadow: "$1",
  gap: "$1",
});

type Props = { editor: Editor | null } & React.ComponentProps<
  typeof StyledToolbar
>;

export function Toolbar({ css, editor, ...props }: Props) {
  if (!editor) {
    return null;
  }

  return (
    <StyledToolbar css={css} {...props}>
      <Button
        size="medium"
        variant="neutral"
        square
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        css={{
          ...hoverStyle({
            backgroundColor: "$gray4",
          }),
        }}
      >
        <Icon label="Konvertiere den ausgewählten Text in eine Überschrift">
          {editor.isActive("heading", { level: 1 }) ? (
            <TextIcon />
          ) : (
            <HeadingIcon />
          )}
        </Icon>
      </Button>
      <Separator
        orientation="vertical"
        decorative
        css={{ alignSelf: "stretch" }}
      />
      <ToggleButton
        size="medium"
        square
        pressed={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Icon label="Markiere den ausgewählten Text fett">
          <FontBoldIcon />
        </Icon>
      </ToggleButton>
      <ToggleButton
        size="medium"
        square
        pressed={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Icon label="Markiere den ausgewählten Text kursiv">
          <FontItalicIcon />
        </Icon>
      </ToggleButton>
      <ToggleButton
        size="medium"
        square
        pressed={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Icon label="Unterstreiche den ausgewählten Text">
          <UnderlineIcon />
        </Icon>
      </ToggleButton>
      <Separator
        orientation="vertical"
        decorative
        css={{ alignSelf: "stretch" }}
      />
      <ToggleButton
        size="medium"
        square
        pressed={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <Icon label="Erstelle eine unnumerierte Liste">
          <ListBulletIcon />
        </Icon>
      </ToggleButton>

      <ToggleButton
        size="medium"
        square
        pressed={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <Icon
          label="Erstelle eine numerierte Liste"
          css={{ width: "0.8em", height: "0.8em" }}
        >
          <NumberedList />
        </Icon>
      </ToggleButton>
      <Separator
        orientation="vertical"
        decorative
        css={{ alignSelf: "stretch" }}
      />
      <ToggleButton
        size="medium"
        square
        pressed={editor.isActive("link")}
        onClick={() =>
          editor.chain().focus().toggleLink({ href: "www.google.com" }).run()
        }
      >
        <Icon label="Erstelle einen Link">
          <Link2Icon />
        </Icon>
      </ToggleButton>
    </StyledToolbar>
  );
}
