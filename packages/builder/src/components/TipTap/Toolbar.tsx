import {
  Box,
  Icon,
  styled,
  ToggleButton,
  Button,
} from "@open-decision/design-system";
import { Type } from "react-feather";
import * as React from "react";
import * as Separator from "@radix-ui/react-separator";
import { Bold, Italic, Link, List, Underline } from "react-feather";
import { HeadingIcon } from "@radix-ui/react-icons";
import { Editor } from "@tiptap/react";
import { NumberedList } from "components/TipTap/NumberedListIcon";

const StyledSeparator = styled(Separator.Root, {
  backgroundColor: "$gray7",
  "&[data-orientation=horizontal]": { height: 1 },
  "&[data-orientation=vertical]": { width: 1 },
});

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
          "&:hover": {
            backgroundColor: "$gray4",
          },
        }}
      >
        <Icon label="Konvertiere den ausgewählten Text in eine Überschrift">
          {editor.isActive("heading", { level: 1 }) ? (
            <Type />
          ) : (
            <HeadingIcon />
          )}
        </Icon>
      </Button>
      <StyledSeparator
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
          <Bold />
        </Icon>
      </ToggleButton>
      <ToggleButton
        size="medium"
        square
        pressed={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Icon label="Markiere den ausgewählten Text kursiv">
          <Italic />
        </Icon>
      </ToggleButton>
      <ToggleButton
        size="medium"
        square
        pressed={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Icon label="Unterstreiche den ausgewählten Text">
          <Underline />
        </Icon>
      </ToggleButton>
      <StyledSeparator
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
          <List />
        </Icon>
      </ToggleButton>

      <ToggleButton
        size="medium"
        square
        pressed={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <Icon label="Erstelle eine numerierte Liste">
          <NumberedList />
        </Icon>
      </ToggleButton>
      <StyledSeparator
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
          <Link />
        </Icon>
      </ToggleButton>
    </StyledToolbar>
  );
}
