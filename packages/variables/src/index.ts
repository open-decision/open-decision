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

export type IVariable =
  | ITextVariable
  | IEmptyVariable
  | IRecordVariable
  | ISelectVariable
  | IMultiSelectVariable
  | IListVariable
  | IModuleVariable;
