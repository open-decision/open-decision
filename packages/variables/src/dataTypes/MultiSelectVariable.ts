import { IBaseVariable, BaseVariable } from "../Variable";
import { TId } from "@open-decision/tree-id";

const typeName = "multi-select";

export interface IMultiSelectVariable<Id extends TId = TId>
  extends IBaseVariable<typeof typeName> {
  id: Id;
  values: { id: string; value?: string }[];
  value: string[];
  readableValue?: string[];
}

class CMultiSelectVariable extends BaseVariable<IMultiSelectVariable> {
  constructor() {
    super(typeName);
  }

  create = <Id extends TId = TId>({
    values = [],
    value = [],
    ...data
  }: Omit<
    IMultiSelectVariable<Id>,
    "type" | "escapedName" | "readableValue" | "value"
  > &
    Partial<Pick<IMultiSelectVariable, "value">>) => {
    return {
      type: this.type,
      values,
      escapedName: this.createReadableKey(data.name),
      value,
      readableValue: value
        ?.map((valueId) => values.find((value) => value.id === valueId)?.value)
        .filter((value): value is string => value !== undefined),
      ...data,
    } satisfies IMultiSelectVariable;
  };
}

export const MultiSelectVariable = new CMultiSelectVariable();
