import { RootEngine } from "flume";
import config from "./config";

const resolvePorts = (portType: string, data: any) => {
  switch (portType) {
    case "string": {
      return data.string;
    }
    case "boolean":
      return data.boolean;
    case "number":
      return data.number;
    case "question": {
      return data.question;
    }
    default:
      return data;
  }
};

const resolveNodes = (node: any, inputValues: any, context: any) => {
  switch (node.type) {
    case "string": {
      return { string: inputValues.string };
    }
    case "boolean":
      return { boolean: inputValues.boolean };
    case "number":
      return { number: inputValues.number };
    case "question_options":
      return { string: inputValues.string };
    case "joinText":
      return { joinedText: inputValues.string1 + " " + inputValues.string2 };
    case "reverseBoolean":
      return { boolean: !inputValues.boolean };
    case "question":
      return { boolean: prompt(inputValues.question) == "Ja" };
    case "yes_no":
      return {
        string: inputValues.yes_no ? inputValues.ja : inputValues.nein,
      };
    default:
      return inputValues;
  }
};

const engine = new RootEngine(config, resolvePorts, resolveNodes);

export default engine;
