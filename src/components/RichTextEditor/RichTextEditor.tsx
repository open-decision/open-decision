import React from "react";
import {
  createAlignPlugin,
  createBlockquotePlugin,
  createBoldPlugin,
  createExitBreakPlugin,
  createHeadingPlugin,
  createHistoryPlugin,
  createImagePlugin,
  createItalicPlugin,
  createLinkPlugin,
  createListPlugin,
  createMediaEmbedPlugin,
  createParagraphPlugin,
  createReactPlugin,
  createResetNodePlugin,
  createSelectOnBackspacePlugin,
  createSlatePluginsComponents,
  createSlatePluginsOptions,
  createSoftBreakPlugin,
  createStrikethroughPlugin,
  createUnderlinePlugin,
  ELEMENT_ALIGN_CENTER,
  ELEMENT_ALIGN_JUSTIFY,
  ELEMENT_ALIGN_RIGHT,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_IMAGE,
  ELEMENT_MEDIA_EMBED,
  ELEMENT_OL,
  ELEMENT_PARAGRAPH,
  ELEMENT_TD,
  ELEMENT_TODO_LI,
  ELEMENT_UL,
  getSlatePluginType,
  HeadingToolbar,
  isBlockAboveEmpty,
  isSelectionAtBlockStart,
  KEYS_HEADING,
  SlatePlugins,
  ToolbarAlign,
  ToolbarImage,
  ToolbarLink,
  ToolbarList,
  useEventEditorId,
  useStoreEditorRef,
} from "@udecode/slate-plugins";
import {
  MdFormatAlignCenter,
  MdFormatAlignJustify,
  MdFormatAlignLeft,
  MdFormatAlignRight,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdImage,
  MdLink,
} from "react-icons/md";

const optionsSoftBreakPlugin = {
  rules: [
    { hotkey: "shift+enter" },
    {
      hotkey: "enter",
      query: {
        allow: [ELEMENT_CODE_BLOCK, ELEMENT_BLOCKQUOTE, ELEMENT_TD],
      },
    },
  ],
};

const optionsExitBreakPlugin = {
  rules: [
    {
      hotkey: "mod+enter",
    },
    {
      hotkey: "mod+shift+enter",
      before: true,
    },
    {
      hotkey: "enter",
      query: {
        start: true,
        end: true,
        allow: KEYS_HEADING,
      },
    },
  ],
};

const resetBlockTypesCommonRule = {
  types: [ELEMENT_BLOCKQUOTE, ELEMENT_TODO_LI],
  defaultType: ELEMENT_PARAGRAPH,
};

const optionsResetBlockTypePlugin = {
  rules: [
    {
      ...resetBlockTypesCommonRule,
      hotkey: "Enter",
      predicate: isBlockAboveEmpty,
    },
    {
      ...resetBlockTypesCommonRule,
      hotkey: "Backspace",
      predicate: isSelectionAtBlockStart,
    },
  ],
};

const pluginsBasic = [
  createReactPlugin(), // withReact
  createHistoryPlugin(), // withHistory
  createParagraphPlugin(), // paragraph element
  createBlockquotePlugin(), // blockquote element
  createHeadingPlugin(), // heading elements
  createAlignPlugin(),
  createImagePlugin(),
  createLinkPlugin(),
  createSelectOnBackspacePlugin({
    allow: [ELEMENT_IMAGE, ELEMENT_MEDIA_EMBED],
  }),
  createBoldPlugin(), // bold mark
  createItalicPlugin(), // italic mark
  createUnderlinePlugin(), // underline mark
  createStrikethroughPlugin(), // strikethrough mark
  createListPlugin(),
  createSoftBreakPlugin(optionsSoftBreakPlugin),
  createExitBreakPlugin(optionsExitBreakPlugin),
  createResetNodePlugin(optionsResetBlockTypePlugin),
  createMediaEmbedPlugin(),
];

const components = createSlatePluginsComponents();
const options = createSlatePluginsOptions();

export const RichTextEditor = (): JSX.Element => {
  const editableProps = {
    placeholder: "Type…",
  };

  const ToolbarButtonsAlign = () => {
    const editor = useStoreEditorRef(useEventEditorId("focus"));

    return (
      <>
        <ToolbarAlign icon={<MdFormatAlignLeft />} />
        <ToolbarAlign
          type={getSlatePluginType(editor, ELEMENT_ALIGN_CENTER)}
          icon={<MdFormatAlignCenter />}
        />
        <ToolbarAlign
          type={getSlatePluginType(editor, ELEMENT_ALIGN_RIGHT)}
          icon={<MdFormatAlignRight />}
        />
        <ToolbarAlign
          type={getSlatePluginType(editor, ELEMENT_ALIGN_JUSTIFY)}
          icon={<MdFormatAlignJustify />}
        />
      </>
    );
  };

  const ToolbarButtonsList = () => {
    const editor = useStoreEditorRef(useEventEditorId("focus"));

    return (
      <>
        <ToolbarList
          type={getSlatePluginType(editor, ELEMENT_UL)}
          icon={<MdFormatListBulleted />}
        />
        <ToolbarList
          type={getSlatePluginType(editor, ELEMENT_OL)}
          icon={<MdFormatListNumbered />}
        />
      </>
    );
  };

  return (
    <div>
      <HeadingToolbar styles={{ root: { padding: "0", margin: "0" } }}>
        <ToolbarButtonsAlign />
        <ToolbarImage icon={<MdImage />} /> <ToolbarLink icon={<MdLink />} />
        <ToolbarButtonsList />
      </HeadingToolbar>
      <SlatePlugins
        editableProps={editableProps}
        components={components}
        options={options}
        plugins={pluginsBasic}
      />
    </div>
  );
};
