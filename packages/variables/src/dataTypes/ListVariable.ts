import { TId } from "@open-decision/tree-ids";
import { IVariable } from "..";
import { IBaseVariable, BaseVariable } from "../Variable";

const typeName = "list";

export interface IListVariable<Id extends TId = TId>
  extends IBaseVariable<typeof typeName, Id> {
  value: IVariable[];
}

class CListVariable extends BaseVariable<IListVariable> {
  constructor() {
    super(typeName);
  }

  create = <Id extends TId = TId>({
    value = [],
    ...data
  }: Omit<IListVariable<Id>, "type" | "escapedName" | "value"> &
    Partial<Pick<IListVariable, "value">>) => {
    return {
      type: this.type,
      escapedName: this.createReadableKey(data.name),
      value,
      ...data,
    } satisfies IListVariable;
  };
}

export const ListVariable = new CListVariable();
