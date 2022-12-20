import {
  Icon,
  Toolbar as SystemToolbar,
  twMerge,
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

const toolbarClasses = "flex items-center py-2 px-1 shadow-1 gap-1";

type Props = { editor: Editor | null } & SystemToolbar.RootProps;

export function Toolbar({ className, editor, ...props }: Props) {
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
    <SystemToolbar.Root
      className={
        className ? twMerge(toolbarClasses, className) : toolbarClasses
      }
      {...props}
    >
      <SystemToolbar.Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        size="small"
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
        className="self-stretch"
      />
      <SystemToolbar.ToggleButton
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        pressed={editor.isActive("bold")}
        size="small"
      >
        <Icon label="Markiere den ausgewählten Text fett">
          <FontBoldIcon />
        </Icon>
      </SystemToolbar.ToggleButton>
      <SystemToolbar.ToggleButton
        size="small"
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        pressed={editor.isActive("italic")}
      >
        <Icon label="Markiere den ausgewählten Text kursiv">
          <FontItalicIcon />
        </Icon>
      </SystemToolbar.ToggleButton>
      <SystemToolbar.ToggleButton
        size="small"
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
        className="self-stretch"
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
        className="bg-layer-3"
      >
        <SystemToolbar.ToggleItem value="BulletList" size="small">
          <Icon label="Erstelle eine unnumerierte Liste">
            <ListBulletIcon />
          </Icon>
        </SystemToolbar.ToggleItem>
        <SystemToolbar.ToggleItem value="OrderedList" size="small">
          <Icon label="Erstelle eine numerierte Liste">
            <NumberedList />
          </Icon>
        </SystemToolbar.ToggleItem>
      </SystemToolbar.ToggleGroup>
    </SystemToolbar.Root>
  );
}
