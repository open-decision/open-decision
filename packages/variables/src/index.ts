import {
  IEmptyVariable,
  ITextVariable,
  IRecordVariable,
  ISelectVariable,
  IMultiSelectVariable,
} from "./dataTypes";

export * from "./dataTypes";

export type IVariable =
  | ITextVariable
  | IEmptyVariable
  | IRecordVariable
  | ISelectVariable
  | IMultiSelectVariable;
