import { textClasses } from "../Text/Text";
import { labelClasses } from "../Label/Label";

export const menuContainerClasses =
  "bg-layer-1 py-2 shadow-7 rounded-md overflow-x-hidden z-10 overflow-y-auto flex flex-col gap-1 border border-gray7 animate-scaleIn origin-[var(--radix-dropdown-menu-content-transform-origin)] max-h-[500px]";

export const menuItemClasses = textClasses({}, [
  "appearance-none colorScheme-primary flex gap-3 mx-2 px-3 py-[6px] rounded-md min-w-[250px] break-all cursor-pointer font-[500] border border-transparent no-underline items-center intent:bg-colorScheme3 disabled:text-colorScheme11 disabled:colorScheme-gray outline-none",
]);

export const menuLabelClasses = labelClasses({ size: "medium" }, [
  "gap-3 mx-2 px-3 py-1",
]);
