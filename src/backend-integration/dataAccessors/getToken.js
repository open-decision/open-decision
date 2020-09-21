import { pathOr } from "ramda";

export const getToken = pathOr("", ["data", "tokenAuth"]);
