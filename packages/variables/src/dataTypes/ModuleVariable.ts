import { TId, TNodeId } from "@open-decision/tree-type";
import { IVariable } from "..";
import { IBaseVariable, BaseVariable } from "../Variable";

const typeName = "module";

export type TModuleVariableHistory = {
  id: TNodeId;
  subHistory?: TModuleVariableHistory;
}[];

export type TModuleVariableValue = {
  history: { nodes: TModuleVariableHistory; position: number };
  variables: Record<string, IVariable>;
};

export interface IModuleVariable<Id extends TId = TId>
  extends IBaseVariable<typeof typeName, Id> {
  value: TModuleVariableValue[];
}

class CModuleVariable extends BaseVariable<IModuleVariable> {
  constructor() {
    super(typeName);
  }

  create = <Id extends TId = TId>({
    value = [],
    ...data
  }: Omit<IModuleVariable<Id>, "type" | "escapedName" | "value"> &
    Partial<Pick<IModuleVariable, "value">>) => {
    return {
      type: this.type,
      escapedName: this.createReadableKey(data.name),
      value,
      ...data,
    } satisfies IModuleVariable;
  };
}

export const ModuleVariable = new CModuleVariable();
