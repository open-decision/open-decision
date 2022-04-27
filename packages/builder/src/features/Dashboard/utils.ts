import { format } from "date-fns";
import de from "date-fns/locale/de";

export const readableDate = (date: Date): string =>
  format(date, "P", { locale: de });
