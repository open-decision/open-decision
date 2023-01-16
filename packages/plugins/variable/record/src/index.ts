import {
  IEmptyVariable,
  IReadableEmptyVariable,
} from "@open-decision/plugins-variable-empty";
import {
  IMultiSelectVariable,
  IReadableMultiSelectVariable,
} from "@open-decision/plugins-variable-multi-select";
import {
  IReadableSelectVariable,
  ISelectVariable,
} from "@open-decision/plugins-variable-select";
import {
  IReadableTextVariable,
  ITextVariable,
} from "@open-decision/plugins-variable-text";
import {
  IReadableVariablePlugin,
  IVariablePlugin,
  VariablePlugin,
} from "@open-decision/tree-type";

const typeName = "record";

type TRecordContent =
  | ITextVariable
  | ISelectVariable
  | IMultiSelectVariable
  | IEmptyVariable;

type TReadableRecordContent =
  | IReadableTextVariable
  | IReadableSelectVariable
  | IReadableMultiSelectVariable
  | IReadableEmptyVariable;

export interface IRecordVariable extends IVariablePlugin<typeof typeName> {
  value?: Record<string, TRecordContent>;
}

export interface IReadableRecordVariable
  extends IReadableVariablePlugin<typeof typeName> {
  value?: Record<string, TReadableRecordContent | undefined>;
}

export class RecordVariablePlugin extends VariablePlugin<
  IRecordVariable,
  IReadableRecordVariable
> {
  constructor() {
    super(typeName);
  }

  create = (
    data: Partial<Omit<IRecordVariable, "type">> & Pick<IRecordVariable, "id">
  ) => {
    return {
      type: this.type,
      ...data,
    } satisfies IRecordVariable;
  };

  // createReadable = (variable: IRecordVariable) => {
  //   if (!variable.name || !variable.value) return;

  //   return {
  //     ...variable,
  //     id: this.createReadableKey(variable.name),
  //     value: mapValues(variable.value, (value) => {
  //       return match(value)
  //         .with({ type: "text" }, (textVariable) =>
  //           TextVariable.createReadable(textVariable)
  //         )
  //         .with({ type: "select" }, (selectVariable) =>
  //           SelectVariable.createReadable(selectVariable)
  //         )
  //         .with({ type: "multi-select" }, (multiSelectVariable) =>
  //           MultiSelectVariable.createReadable(multiSelectVariable)
  //         )
  //         .with({ type: "empty" }, (emptyVariable) =>
  //           EmptyVariable.createReadable(emptyVariable)
  //         )
  //         .otherwise(() => undefined);
  //     }),
  //   } satisfies IReadableRecordVariable;
  // };
}
