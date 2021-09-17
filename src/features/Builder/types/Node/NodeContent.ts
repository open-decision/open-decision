import * as T from "io-ts";

export const TextBooleanMarks = T.partial({
  bold: T.boolean,
  italic: T.boolean,
  underline: T.boolean,
});

export const CustomText = T.intersection([
  T.type({
    text: T.string,
  }),
  TextBooleanMarks,
]);

export const ElementUnionMarks = T.partial({
  justify: T.keyof({ left: null, center: null, right: null }),
});

export const Element = T.intersection([
  ElementUnionMarks,
  T.type({ children: T.array(CustomText) }),
]);

export const TextTags = T.keyof({ p: null, h1: null, h2: null, h3: null });

export const ListTags = T.keyof({ ul: null, ol: null, li: null });

export const LinkTags = T.keyof({ a: null });

export const TextElements = T.intersection([
  Element,
  T.type({ type: TextTags }),
]);

export const ListElements = T.intersection([
  Element,
  T.type({ type: ListTags }),
]);

export const LinkElement = T.intersection([
  Element,
  T.type({ type: LinkTags, href: T.string }),
]);

export const GroupElement: T.Type<GroupElementType> = T.recursion(
  "GroupElement",
  () =>
    T.intersection([
      ElementUnionMarks,
      T.type({
        type: T.literal("group"),
        children: T.union([
          T.array(CustomElement),
          T.array(GroupElement),
          T.array(CustomText),
        ]),
      }),
    ])
);

export const CustomElement = T.union([
  TextElements,
  ListElements,
  LinkElement,
  GroupElement,
]);

export const Descendants = T.array(T.union([CustomElement, CustomText]));

// ------------------------------------------------------------------
// Types

export type TextBooleanMarks = T.TypeOf<typeof TextBooleanMarks>;
export type CustomText = T.TypeOf<typeof CustomText>;
export type ElementUnionMarks = T.TypeOf<typeof ElementUnionMarks>;
export type TextTags = T.TypeOf<typeof TextTags>;
export type ListTags = T.TypeOf<typeof ListTags>;
export type LinkTags = T.TypeOf<typeof LinkTags>;
export type TextElements = T.TypeOf<typeof TextElements>;
export type ListElements = T.TypeOf<typeof ListElements>;
export type LinkElement = T.TypeOf<typeof LinkElement>;
export type GroupElementType = ElementUnionMarks & {
  type: "group";
  children: CustomText[] | CustomElement[] | GroupElementType[];
};
export type CustomElement = T.TypeOf<typeof CustomElement>;

export type Elements = CustomElement["type"];
