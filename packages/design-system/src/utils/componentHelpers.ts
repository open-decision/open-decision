import { omitBy, pickBy } from "remeda";

export type Variants<VariantClasses> = {
  [Property in keyof VariantClasses]: keyof VariantClasses[Property];
};

export const getVariantProps = <TVariantProps extends Record<string, any>>(
  props: Record<string, any>,
  variants: TVariantProps
): {
  variantProps: Variants<TVariantProps>;
  otherProps: Record<string, any>;
} => {
  const isVariant = (key: string) => Object.keys(variants).includes(key);

  const variantProps = pickBy(props, (_, key) =>
    isVariant(key)
  ) as Variants<TVariantProps>;

  const otherProps = omitBy(props, (_, key) => !isVariant(key));

  return { variantProps, otherProps };
};
