import { z } from "zod";

// ------------------------------------------------------------------
// Text

export const BooleanMarks = z.object({
  bold: z.boolean().optional(),
  italic: z.boolean().optional(),
  underline: z.boolean().optional(),
});

export const Text = z
  .object({
    text: z.string(),
  })
  .and(BooleanMarks);

// ------------------------------------------------------------------
// Inline ELements
export const LinkTag = z.literal("link");
export const InlineTags = LinkTag;

export const LinkElement = z.object({
  type: LinkTag,
  url: z.string().url(),
  children: z.array(Text),
});

export const InlineElements = LinkElement;

// ------------------------------------------------------------------
// Block Elements

const BaseElement = z.object({
  children: z.array(z.union([Text, LinkElement])),
});

export const TextTags = z.enum(["paragraph", "heading"]);
export const ListTags = z.enum(["unordered_list", "ordered_list"]);
export const ListItemTag = z.literal("list_item");
export const CombinedListTags = z.enum([
  "unordered_list",
  "ordered_list",
  "list_item",
]);
export const BlockTags = z.union([TextTags, ListTags]);

export const TextElements = BaseElement.extend({
  type: TextTags,
});

export const ListItemElement = BaseElement.extend({
  type: ListItemTag,
});

export const ListElements = z.object({
  type: ListTags,
  children: z.array(ListItemElement),
});

// ------------------------------------------------------------------

export const Element = z.union([
  TextElements,
  ListElements,
  LinkElement,
  ListItemElement,
]);

export const Descendants = z.array(z.union([Element, Text]));

// ------------------------------------------------------------------
// Types

export type TBooleanMarks = z.infer<typeof BooleanMarks>;
export type TText = z.infer<typeof Text>;
export type TTextTags = z.infer<typeof TextTags>;
export type TListTags = z.infer<typeof CombinedListTags>;
export type TLinkTags = z.infer<typeof LinkTag>;
export type TTextElements = z.infer<typeof TextElements>;
export type TListElements = z.infer<typeof ListElements>;
export type TListItemElement = z.infer<typeof ListItemElement>;
export type TLinkElement = z.infer<typeof LinkElement>;
export type TBlockElements = z.infer<typeof BlockTags>;
export type TInlineElements = z.infer<typeof InlineTags>;
export type TElement = z.infer<typeof Element>;
export type TElements = TElement["type"];
