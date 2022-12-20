import { IntlMessageFormat } from "intl-messageformat";

export const translate = (val: string) =>
  new IntlMessageFormat(val, "de").format;
