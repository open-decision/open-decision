import {
  Icon,
  styled,
  Toolbar as SystemToolbar,
} from "@open-decision/design-system";
import * as React from "react";
import {
  FontBoldIcon,
  FontItalicIcon,
  HeadingIcon,
  ListBulletIcon,
  TextIcon,
  UnderlineIcon,
} from "@radix-ui/react-icons";
import { Editor } from "@tiptap/react";
import { NumberedList } from "./NumberedListIcon";

const StyledToolbar = styled(SystemToolbar.Root, {
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

  const listMarks = ["OrderedList", "BulletList"] as const;

  const listMarksState = editor.isActive("bulletList")
    ? "BulletList"
    : editor.isActive("orderedList")
    ? "OrderedList"
    : undefined;

  const validListMark = (value: any): value is typeof listMarks[number] =>
    listMarks.includes(value);

  return (
    <StyledToolbar css={css} {...props}>
      <SystemToolbar.Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Icon label="Konvertiere den ausgewählten Text in eine Überschrift">
          {editor.isActive("heading", { level: 1 }) ? (
            <TextIcon />
          ) : (
            <HeadingIcon />
          )}
        </Icon>
      </SystemToolbar.Button>
      <SystemToolbar.Separator
        orientation="vertical"
        decorative
        css={{ alignSelf: "stretch" }}
      />
      <SystemToolbar.ToggleButton
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        pressed={editor.isActive("bold")}
      >
        <Icon label="Markiere den ausgewählten Text fett">
          <FontBoldIcon />
        </Icon>
      </SystemToolbar.ToggleButton>
      <SystemToolbar.ToggleButton
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        pressed={editor.isActive("italic")}
      >
        <Icon label="Markiere den ausgewählten Text kursiv">
          <FontItalicIcon />
        </Icon>
      </SystemToolbar.ToggleButton>
      <SystemToolbar.ToggleButton
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        pressed={editor.isActive("underline")}
      >
        <Icon label="Unterstreiche den ausgewählten Text">
          <UnderlineIcon />
        </Icon>
      </SystemToolbar.ToggleButton>
      <SystemToolbar.Separator
        orientation="vertical"
        decorative
        css={{ alignSelf: "stretch" }}
      />
      <SystemToolbar.ToggleGroup
        type="single"
        defaultValue={listMarksState}
        onValueChange={(value) => {
          if (!validListMark(value)) {
            if (editor.isActive("orderedList"))
              return editor.chain().focus().toggleOrderedList().run();
            if (editor.isActive("bulletList"))
              return editor.chain().focus().toggleBulletList().run();

            return;
          }

          return editor.chain().focus()[`toggle${value}`]?.().run();
        }}
        css={{ layer: "3" }}
      >
        <SystemToolbar.ToggleItem value="BulletList">
          <Icon label="Erstelle eine unnumerierte Liste">
            <ListBulletIcon />
          </Icon>
        </SystemToolbar.ToggleItem>
        <SystemToolbar.ToggleItem value="OrderedList">
          <Icon label="Erstelle eine numerierte Liste">
            <NumberedList />
          </Icon>
        </SystemToolbar.ToggleItem>
      </SystemToolbar.ToggleGroup>
    </StyledToolbar>
  );
}
