import { TNodeTypes, TPortTypes } from "../types/Tree";

export const examplePortTypes: TPortTypes = {
  number: {
    type: "number",
  },
};

export const exampleNodeTypes: TNodeTypes = {
  default: {
    type: "customNode",
    label: "Default",
  },
};
