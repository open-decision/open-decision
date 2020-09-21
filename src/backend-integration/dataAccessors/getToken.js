import { propOr } from "ramda";

export const getToken = propOr("", "tokenAuth");
