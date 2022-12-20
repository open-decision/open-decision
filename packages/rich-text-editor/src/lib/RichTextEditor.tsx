import { ScrollArea, headingClasses } from "@open-decision/design-system";
import {
  EditorContent,
  Content,
  useEditor,
  EditorEvents,
  EditorContentProps,
} from "@tiptap/react";
import { Toolbar } from "./Toolbar";
import { extensions } from "./shared";
import styles from "./RichTextEditor.module.css";

type Props = {
  content?: Content;
  onUpdate: (props: EditorEvents["update"]) => void;
  Label?: ((props: { onClick: () => void }) => JSX.Element) | string;
  maxHeight?: number;
} & Omit<EditorContentProps, "editor" | "content" | "ref">;

export const RichTextEditor = ({
  content,
  onUpdate,
  Label,
  maxHeight,
  ...props
}: Props) => {
  const editor = useEditor({
    extensions,
    content,
    onUpdate,
  });

  return (
    <>
      {typeof Label === "string" ? (
        <label
          className={headingClasses({ size: "extra-small" }, "m-0 mb-3 block")}
        >
          {Label}
        </label>
      ) : (
        Label?.({ onClick: () => editor?.commands.focus() })
      )}
      <div
        className="grid"
        style={{
          gridTemplateRows: `50px minmax(200px, ${
            maxHeight ? `${maxHeight}px` : "1fr"
          })`,
        }}
      >
        <Toolbar
          editor={editor}
          className="h-[50px] border border-gray7 border-b-0 rounded-tl-md rounded-tr-md bg-layer-3"
        />
        <ScrollArea.Root
          className="min-h-[200px] bg-layer-2 border border-gray7 rounded-bl-md rounded-br-md overflow-hidden focus-within:inner-focus"
          style={{
            maxHeight: `${maxHeight}px`,
          }}
          data-focus={editor?.isFocused}
        >
          <ScrollArea.Viewport className="h-full [&>div]:h-full [&>div]:!block">
            <EditorContent
              className={`${styles.editor} p-2`}
              editor={editor}
              {...props}
            />
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar />
        </ScrollArea.Root>
      </div>
    </>
  );
};
