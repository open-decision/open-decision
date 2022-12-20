import { ClassNameArrayProp, stackClasses } from "@open-decision/design-system";

export const cardClasses = (className?: ClassNameArrayProp) =>
  stackClasses({}, [
    "p-5 border border-gray7 shadow-1 rounded-md bg-layer-1 gap-4 focus-visible:inner-focus",
    className,
  ]);
