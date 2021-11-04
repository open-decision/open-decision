import { z } from "zod";

export const TextBooleanMarks = z.object({
  bold: z.boolean().optional(),
  italic: z.boolean().optional(),
  underline: z.boolean().optional(),
});

export const CustomText = z
  .object({
    text: z.string(),
  })
  .and(TextBooleanMarks);

export const ElementUnionMarks = z.object({
  justify: z.enum(["left", "center", "right"]).optional(),
});

export const Element = z
  .object({
    children: z.array(CustomText),
  })
  .and(ElementUnionMarks);

export const TextTags = z.enum(["p", "heading"]);

export const ListTags = z.enum(["ul", "ol", "li"]);

export const LinkTag = z.literal("a");

export const TextElements = Element.and(z.object({ type: TextTags }));

export const ListElements = Element.and(z.object({ type: ListTags }));

export const LinkElement = Element.and(
  z.object({ type: LinkTag, href: z.string() })
);

export const GroupElement: z.ZodSchema<GroupElementType> = z.lazy(() =>
  ElementUnionMarks.and(
    z.object({
      type: z.literal("group"),
      children: z.union([
        z.array(CustomElement),
        z.array(GroupElement),
        z.array(CustomText),
      ]),
    })
  )
);

export const CustomElement = z.union([
  TextElements,
  ListElements,
  LinkElement,
  GroupElement,
]);

export const Descendants = z.array(z.union([CustomElement, CustomText]));

// ------------------------------------------------------------------
// Types

export type TextBooleanMarks = z.infer<typeof TextBooleanMarks>;
export type CustomText = z.infer<typeof CustomText>;
export type ElementUnionMarks = z.infer<typeof ElementUnionMarks>;
export type TextTags = z.infer<typeof TextTags>;
export type ListTags = z.infer<typeof ListTags>;
export type LinkTags = z.infer<typeof LinkTag>;
export type TextElements = z.infer<typeof TextElements>;
export type ListElements = z.infer<typeof ListElements>;
export type LinkElement = z.infer<typeof LinkElement>;
export type GroupElementType = ElementUnionMarks & {
  type: "group";
  children: CustomText[] | CustomElement[] | GroupElementType[];
};
export type CustomElement = z.infer<typeof CustomElement>;

export type Elements = CustomElement["type"];
