import { IntlMessageFormat } from "intl-messageformat";

export const t = (val: string) => new IntlMessageFormat(val, "de").format;
