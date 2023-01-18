import { TId } from "@open-decision/tree-type";
import { IVariable } from "..";
import { IBaseVariable, BaseVariable } from "../Variable";

const typeName = "module";

export interface IModuleVariable<Id extends TId = TId>
  extends IBaseVariable<typeof typeName, Id> {
  value?: Record<string, IVariable>[];
}

class CModuleVariable extends BaseVariable<IModuleVariable> {
  constructor() {
    super(typeName);
  }

  create = <Id extends TId = TId>(
    data: Omit<IModuleVariable<Id>, "type" | "escapedName">
  ) => {
    return {
      type: this.type,
      escapedName: this.createReadableKey(data.name),
      ...data,
    } satisfies IModuleVariable;
  };
}

export const ModuleVariable = new CModuleVariable();
