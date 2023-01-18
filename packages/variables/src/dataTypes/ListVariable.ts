import { TId } from "@open-decision/tree-type";
import { IVariable } from "..";
import { IBaseVariable, BaseVariable } from "../Variable";

const typeName = "list";

export interface IListVariable<Id extends TId = TId>
  extends IBaseVariable<typeof typeName, Id> {
  value?: IVariable[];
}

class CListVariable extends BaseVariable<IListVariable> {
  constructor() {
    super(typeName);
  }

  create = <Id extends TId = TId>(
    data: Omit<IListVariable<Id>, "type" | "escapedName">
  ) => {
    return {
      type: this.type,
      escapedName: this.createReadableKey(data.name),
      ...data,
    } satisfies IListVariable;
  };
}

export const ListVariable = new CListVariable();
