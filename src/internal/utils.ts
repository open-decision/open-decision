export type ColorKeys =
  | "gray"
  | "primary"
  | "accent"
  | "error"
  | "success"
  | "warning"
  | "info"
  | "grayA"
  | "primaryA"
  | "accentA"
  | "errorA"
  | "successA"
  | "warningA"
  | "infoA";

export type ColorLevels =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12";

type ColorSpectrum<TAlias extends string> = `${TAlias}${ColorLevels}`;

type AllColorsKeys = `${ColorKeys}${ColorLevels}`;

export type SystemColors = Record<AllColorsKeys, string> & {
  shadowColor: string;
};

export const aliasColor = <TAlias extends string>(
  alias: TAlias,
  color: Record<ColorSpectrum<string>, string>,
  bright = false
): Record<ColorSpectrum<TAlias>, string> => {
  const colors = Object.values<string>(color);

  return {
    [`${alias}1`]: colors[0],
    [`${alias}2`]: colors[1],
    [`${alias}3`]: colors[2],
    [`${alias}4`]: colors[3],
    [`${alias}5`]: colors[4],
    [`${alias}6`]: colors[5],
    [`${alias}7`]: colors[6],
    [`${alias}8`]: colors[7],
    [`${alias}9`]: colors[8],
    [`${alias}10`]: colors[9],
    [`${alias}11`]: colors[10],
    [`${alias}12`]: colors[11],
    [`${alias}-text`]: bright ? colors[11] : colors[0],
  } as Record<ColorSpectrum<TAlias>, string>;
};

export type TextStyles =
  | "large-heading"
  | "medium-heading"
  | "small-heading"
  | "extra-small-heading"
  | "button"
  | "badge"
  | "overline"
  | "large-text"
  | "medium-text"
  | "small-text"
  | "caption";
