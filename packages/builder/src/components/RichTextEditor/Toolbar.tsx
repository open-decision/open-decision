import {
  Box,
  Icon,
  styled,
  ToggleButton,
  Button,
} from "@open-legal-tech/design-system";
import { Type } from "react-feather";
import * as React from "react";
import * as Separator from "@radix-ui/react-separator";
import { Bold, Italic, Link, List, Underline } from "react-feather";
import { HeadingIcon, QuestionMarkIcon } from "@radix-ui/react-icons";
import { Editor } from "@tiptap/react";

const StyledSeparator = styled(Separator.Root, {
  backgroundColor: "$gray8",
  "&[data-orientation=horizontal]": { height: 1 },
  "&[data-orientation=vertical]": { width: 1 },
});

const StyledToolbar = styled(Box, {
  display: "flex",
  alignItems: "center",
  backgroundColor: "$gray2",
  padding: "$2 $1",
  boxShadow: "$1",
  gap: "$1",
});

type Props = { editor: Editor | null } & React.ComponentProps<
  typeof StyledToolbar
>;

export function Toolbar({ css, editor, ...props }: Props) {
  // const editor = useSlate();
  // const toggleEditorMark = toggleBooleanMark(editor);
  // const toggleEditorElement = toggleElement(editor);
  // const toggleListElement = toggleList(editor);

  // const isMarkActive = isBooleanMarkActive(editor);
  // const isHeading = isElement(editor)("heading");
  // const isNumberedList = isElement(editor)("ordered_list");
  // const isList = isElement(editor)("unordered_list");
  // const isLink = isElement(editor)("link");

  if (!editor) {
    return null;
  }

  return (
    <StyledToolbar css={css} {...props}>
      <Button
        size="small"
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
        square
        pressed={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Icon size="small" label="Markiere den ausgewählten Text fett">
          <Bold />
        </Icon>
      </ToggleButton>
      <ToggleButton
        square
        pressed={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Icon size="small" label="Markiere den ausgewählten Text kursiv">
          <Italic />
        </Icon>
      </ToggleButton>
      <ToggleButton
        square
        pressed={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Icon size="small" label="Unterstreiche den ausgewählten Text">
          <Underline />
        </Icon>
      </ToggleButton>
      <ToggleButton
        square
        pressed={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <Icon size="small" label="Erstelle eine unnumerierte Liste">
          <List />
        </Icon>
      </ToggleButton>

      <ToggleButton
        square
        pressed={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <Icon size="small" label="Erstelle eine numerierte Liste">
          <QuestionMarkIcon />
        </Icon>
      </ToggleButton>
      <StyledSeparator
        orientation="vertical"
        decorative
        css={{ alignSelf: "stretch" }}
      />
      <ToggleButton
        square
        pressed={editor.isActive("link")}
        onMouseDown={() =>
          editor.chain().focus().toggleLink({ href: "www.google.com" }).run()
        }
      >
        <Icon size="small" label="Erstelle eine numerierte Liste">
          <Link />
        </Icon>
      </ToggleButton>
    </StyledToolbar>
  );
}
