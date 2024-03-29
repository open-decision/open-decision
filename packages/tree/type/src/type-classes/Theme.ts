import { z } from "zod";

export const Theme = z.object({
  "colors-gray1": z.string().optional(),
  "colors-gray2": z.string().optional(),
  "colors-gray3": z.string().optional(),
  "colors-gray4": z.string().optional(),
  "colors-gray5": z.string().optional(),
  "colors-gray6": z.string().optional(),
  "colors-gray7": z.string().optional(),
  "colors-gray8": z.string().optional(),
  "colors-gray9": z.string().optional(),
  "colors-gray10": z.string().optional(),
  "colors-gray11": z.string().optional(),
  "colors-gray12": z.string().optional(),
  "colors-primary1": z.string().optional(),
  "colors-primary2": z.string().optional(),
  "colors-primary3": z.string().optional(),
  "colors-primary4": z.string().optional(),
  "colors-primary5": z.string().optional(),
  "colors-primary6": z.string().optional(),
  "colors-primary7": z.string().optional(),
  "colors-primary8": z.string().optional(),
  "colors-primary9": z.string().optional(),
  "colors-primary10": z.string().optional(),
  "colors-primary11": z.string().optional(),
  "colors-primary12": z.string().optional(),
  "colors-accent1": z.string().optional(),
  "colors-accent2": z.string().optional(),
  "colors-accent3": z.string().optional(),
  "colors-accent4": z.string().optional(),
  "colors-accent5": z.string().optional(),
  "colors-accent6": z.string().optional(),
  "colors-accent7": z.string().optional(),
  "colors-accent8": z.string().optional(),
  "colors-accent9": z.string().optional(),
  "colors-accent10": z.string().optional(),
  "colors-accent11": z.string().optional(),
  "colors-accent12": z.string().optional(),
  "colors-danger1": z.string().optional(),
  "colors-danger2": z.string().optional(),
  "colors-danger3": z.string().optional(),
  "colors-danger4": z.string().optional(),
  "colors-danger5": z.string().optional(),
  "colors-danger6": z.string().optional(),
  "colors-danger7": z.string().optional(),
  "colors-danger8": z.string().optional(),
  "colors-danger9": z.string().optional(),
  "colors-danger10": z.string().optional(),
  "colors-danger11": z.string().optional(),
  "colors-danger12": z.string().optional(),
  "colors-success1": z.string().optional(),
  "colors-success2": z.string().optional(),
  "colors-success3": z.string().optional(),
  "colors-success4": z.string().optional(),
  "colors-success5": z.string().optional(),
  "colors-success6": z.string().optional(),
  "colors-success7": z.string().optional(),
  "colors-success8": z.string().optional(),
  "colors-success9": z.string().optional(),
  "colors-success10": z.string().optional(),
  "colors-success11": z.string().optional(),
  "colors-success12": z.string().optional(),
  "colors-warning1": z.string().optional(),
  "colors-warning2": z.string().optional(),
  "colors-warning3": z.string().optional(),
  "colors-warning4": z.string().optional(),
  "colors-warning5": z.string().optional(),
  "colors-warning6": z.string().optional(),
  "colors-warning7": z.string().optional(),
  "colors-warning8": z.string().optional(),
  "colors-warning9": z.string().optional(),
  "colors-warning10": z.string().optional(),
  "colors-warning11": z.string().optional(),
  "colors-warning12": z.string().optional(),
  "colors-info1": z.string().optional(),
  "colors-info2": z.string().optional(),
  "colors-info3": z.string().optional(),
  "colors-info4": z.string().optional(),
  "colors-info5": z.string().optional(),
  "colors-info6": z.string().optional(),
  "colors-info7": z.string().optional(),
  "colors-info8": z.string().optional(),
  "colors-info9": z.string().optional(),
  "colors-info10": z.string().optional(),
  "colors-info11": z.string().optional(),
  "colors-info12": z.string().optional(),
  "colors-black": z.string().optional(),
  "colors-white": z.string().optional(),
  "colors-layer1": z.string().optional(),
  "colors-layer2": z.string().optional(),
  "colors-layer3": z.string().optional(),
  "colors-layer4": z.string().optional(),
  "colors-layer5": z.string().optional(),
  "colors-shadow": z.string().optional(),
  "space-1": z.string().optional(),
  "space-2": z.string().optional(),
  "space-3": z.string().optional(),
  "space-4": z.string().optional(),
  "space-5": z.string().optional(),
  "space-6": z.string().optional(),
  "space-7": z.string().optional(),
  "space-8": z.string().optional(),
  "space-9": z.string().optional(),
  "space-10": z.string().optional(),
  "space-11": z.string().optional(),
  "space-12": z.string().optional(),
  "fontSize-extra-large-heading": z.string().optional(),
  "fontSize-large-heading": z.string().optional(),
  "fontSize-medium-heading": z.string().optional(),
  "fontSize-small-heading": z.string().optional(),
  "fontSize-extra-small-heading": z.string().optional(),
  "fontSize-large-text": z.string().optional(),
  "fontSize-medium-text": z.string().optional(),
  "fontSize-small-text": z.string().optional(),
  "fontSize-extra-small-text": z.string().optional(),
  "letterSpacing-extra-large-heading": z.string().optional(),
  "letterSpacing-large-heading": z.string().optional(),
  "letterSpacing-medium-heading": z.string().optional(),
  "letterSpacing-small-heading": z.string().optional(),
  "letterSpacing-extra-small-heading": z.string().optional(),
  "letterSpacing-large-text": z.string().optional(),
  "letterSpacing-medium-text": z.string().optional(),
  "letterSpacing-small-text": z.string().optional(),
  "letterSpacing-extra-small-text": z.string().optional(),
  "lineHeight-extra-large-heading": z.string().optional(),
  "lineHeight-large-heading": z.string().optional(),
  "lineHeight-medium-heading": z.string().optional(),
  "lineHeight-small-heading": z.string().optional(),
  "lineHeight-extra-small-heading": z.string().optional(),
  "lineHeight-large-text": z.string().optional(),
  "lineHeight-medium-text": z.string().optional(),
  "lineHeight-small-text": z.string().optional(),
  "lineHeight-extra-small-text": z.string().optional(),
  "fontWeight-extra-large-heading": z.number().optional(),
  "fontWeight-large-heading": z.number().optional(),
  "fontWeight-medium-heading": z.number().optional(),
  "fontWeight-small-heading": z.number().optional(),
  "fontWeight-extra-small-heading": z.number().optional(),
  "fontWeight-large-text": z.number().optional(),
  "fontWeight-medium-text": z.number().optional(),
  "fontWeight-small-text": z.number().optional(),
  "fontWeight-extra-small-text": z.number().optional(),
  "fontFamily-sans": z.string().optional(),
  "fontFamily-serif": z.string().optional(),
  "fontFamily-heading": z.string().optional(),
  "fontFamily-text": z.string().optional(),
  "radius-none": z.string().optional(),
  "radius-sm": z.string().optional(),
  "radius-md": z.string().optional(),
  "radius-lg": z.string().optional(),
  "radius-xl": z.string().optional(),
  "radius-2xl": z.string().optional(),
  "radius-3xl": z.string().optional(),
  "radius-4xl": z.string().optional(),
  "radius-full": z.string().optional(),
});
