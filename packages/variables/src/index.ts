import {
  IEmptyVariable,
  ITextVariable,
  IRecordVariable,
  ISelectVariable,
  IMultiSelectVariable,
  IListVariable,
  IModuleVariable,
} from "./dataTypes";

export * from "./dataTypes";

export type IVariable = IPrimitiveVariable | IGroupVariable;

export type IGroupVariable = IRecordVariable | IListVariable | IModuleVariable;

export const isGroupVariable = (
  variable: IVariable
): variable is IGroupVariable =>
  variable.type === "record" ||
  variable.type === "list" ||
  variable.type === "module";

export const isPrimitiveVariable = (
  variable: IVariable
): variable is IPrimitiveVariable =>
  variable.type === "text" ||
  variable.type === "empty" ||
  variable.type === "select" ||
  variable.type === "multi-select";

export type IPrimitiveVariable =
  | ITextVariable
  | IEmptyVariable
  | ISelectVariable
  | IMultiSelectVariable;
