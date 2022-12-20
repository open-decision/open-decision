import { cva, VariantProps } from "class-variance-authority";

export const baseInputClasses = cva(
  "focus-within:inner-focus medium-text colorScheme-primary border border-gray5 disabled:opacity-40",
  {
    variants: {
      variant: {
        raised: "bg-layer-2",
        lowered: "bg-layer-4 border-transparent",
      },
    },

    defaultVariants: {
      variant: "raised",
    },
  }
);

export type BaseInputVariants = VariantProps<typeof baseInputClasses>;

export const textInputClasses = cva("rounded-md flex items-center", {
  variants: {
    size: {
      small: "small-text py-1 px-2",
      medium: "medium-text py-2 px-3",
      large: "large-text py-3 px-4",
    },
    defaultVariants: {
      size: "medium",
    },
  },
});

export type TextInputVariants = VariantProps<typeof textInputClasses>;

export const inputWrapperClasses =
  "flex items-center justify-center text-white checked:bg-colorScheme9 checked:border-colorScheme9 checked:text-colorScheme9";
