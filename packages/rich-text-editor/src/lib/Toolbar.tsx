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

  const textMarks = ["Bold", "Italic", "Underline"] as const;

  const textMarksState = [
    editor.isActive("bold") && "Bold",
    editor.isActive("italic") && "Italic",
    editor.isActive("underline") && "Underline",
  ].filter((element): element is typeof textMarks[number] => element != null);

  const validTextMark = (value: any): value is typeof textMarks[number] =>
    textMarks.includes(value);

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
      <SystemToolbar.ToggleGroup
        type="multiple"
        value={textMarksState}
        onValueChange={(values) =>
          values.forEach((value) => {
            if (!validTextMark(value)) return;

            return editor.chain().focus()[`toggle${value}`]?.().run();
          })
        }
      >
        <SystemToolbar.ToggleButton value="Bold">
          <Icon label="Markiere den ausgewählten Text fett">
            <FontBoldIcon />
          </Icon>
        </SystemToolbar.ToggleButton>
        <SystemToolbar.ToggleButton value="Italic">
          <Icon label="Markiere den ausgewählten Text kursiv">
            <FontItalicIcon />
          </Icon>
        </SystemToolbar.ToggleButton>
        <SystemToolbar.ToggleButton value="Underline">
          <Icon label="Unterstreiche den ausgewählten Text">
            <UnderlineIcon />
          </Icon>
        </SystemToolbar.ToggleButton>
      </SystemToolbar.ToggleGroup>
      <SystemToolbar.Separator
        orientation="vertical"
        decorative
        css={{ alignSelf: "stretch" }}
      />
      <SystemToolbar.ToggleGroup
        type="single"
        value={listMarksState}
        onValueChange={(value) => {
          if (!validListMark(value)) return;

          return editor.chain().focus()[`toggle${value}`]?.().run();
        }}
      >
        <SystemToolbar.ToggleButton value="BulletList">
          <Icon label="Erstelle eine unnumerierte Liste">
            <ListBulletIcon />
          </Icon>
        </SystemToolbar.ToggleButton>
        <SystemToolbar.ToggleButton value="OrderedList">
          <Icon label="Erstelle eine numerierte Liste" css={{}}>
            <NumberedList />
          </Icon>
        </SystemToolbar.ToggleButton>
      </SystemToolbar.ToggleGroup>
      {/* <Separator
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
      </ToggleButton> */}
    </StyledToolbar>
  );
}
