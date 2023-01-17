export const createReadableKey = (key: string) =>
  key
    .split(" ")
    .join("_")
    .replace(/\u00df/g, "ss")
    .replace(/\u00e4/g, "ae")
    .replace(/\u00f6/g, "oe")
    .replace(/\u00fc/g, "ue")
    .replace(/\u00c4/g, "Ae")
    .replace(/\u00d6/g, "Oe")
    .replace(/\u00dc/g, "Ue")
    .replace(/\W/g, "");
