import {
  stackClasses,
  headingClasses as systemHeadingClasses,
  textClasses,
} from "@open-decision/design-system";

export const containerClasses = stackClasses(
  {},
  "gap-6 bg-layer-1 w-[clamp(400px,50vw,500px)] p-9 shadow-7 rounded-md"
);
export const headerClasses = stackClasses({}, "gap-2");
export const headingClasses = systemHeadingClasses({ size: "large" });
export const descriptionClasses = textClasses({ size: "large" }, "text-gray11");
export const footerClasses = textClasses({}, "text-gray11");
