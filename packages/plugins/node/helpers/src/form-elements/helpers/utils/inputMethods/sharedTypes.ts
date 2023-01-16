import { INodePlugin } from "@open-decision/tree-type";
import { IInputPlugin } from "../../InputPlugin";

export interface InputWithRequired extends IInputPlugin<string> {
  required: boolean;
}

export interface NodeWithInput extends INodePlugin<string> {
  input?: string;
}
