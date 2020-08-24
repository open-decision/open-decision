import { RootEngine } from "flume";
import config from "./config";

const resolvePorts = (portType, data) => {
  switch (portType) {
    case "string":
      return data.string;
    case "boolean":
      return data.boolean;
    case "number":
      return data.number;
    default:
      return data;
  }
};

const resolveNodes = (node, inputValues, nodeType, context) => {
  switch (node.type) {
    case "string":
      return { string: inputValues.string };
    case "boolean":
      return { boolean: inputValues.boolean };
    case "number":
      return { number: inputValues.number };
    case "user":
      return context.user;
    case "joinText":
      return { joinedText: inputValues.string1 + inputValues.string2 };
    case "reverseBoolean":
      return { boolean: !inputValues.boolean };
    default:
      return inputValues;
  }
};

const engine = new RootEngine(config, resolvePorts);

export default engine;
