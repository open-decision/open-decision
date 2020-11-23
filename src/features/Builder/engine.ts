import { RootEngine } from "flume";
import config from "./config";

const resolvePorts = (portType: string, data: any) => {
  switch (portType) {
    case "string": {
      return data.string;
    }
    default:
      return data;
  }
};

const resolveNodes = (node: any, inputValues: any, context: any) => {
  switch (node.type) {
    case "dependent": {
      return { string: inputValues.question };
    }
    case "independent": {
      return { string: inputValues.string };
    }
    default:
      return inputValues;
  }
};

const engine = new RootEngine(config, resolvePorts, resolveNodes);

export default engine;
