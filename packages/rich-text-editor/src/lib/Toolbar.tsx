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
  const activeListValue = editor?.isActive("bulletList")
    ? "bulletList"
    : editor?.isActive("orderedList")
    ? "orderedList"
    : "";

  if (!editor) {
    return null;
  }

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
        key={activeListValue}
        type="single"
        value={activeListValue}
        onValueChange={(newValue) => {
          if (
            !newValue &&
            (activeListValue === "bulletList" ||
              activeListValue === "orderedList")
          ) {
            editor
              .chain()
              .focus()
              .toggleList(activeListValue, "listItem")
              .run();
          }

          if (newValue === "bulletList") {
            editor.chain().focus().toggleBulletList().run();
          } else if (newValue === "orderedList") {
            editor.chain().focus().toggleOrderedList().run();
          }

          return newValue;
        }}
      >
        <SystemToolbar.ToggleItem value="bulletList" size="small">
          <Icon label="Erstelle eine unnumerierte Liste">
            <ListBulletIcon />
          </Icon>
        </SystemToolbar.ToggleItem>
        <SystemToolbar.ToggleItem value="orderedList" size="small">
          <Icon label="Erstelle eine numerierte Liste">
            <NumberedList />
          </Icon>
        </SystemToolbar.ToggleItem>
      </SystemToolbar.ToggleGroup>
    </SystemToolbar.Root>
  );
}
