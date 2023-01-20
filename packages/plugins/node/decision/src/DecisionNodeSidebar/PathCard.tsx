import {
  Form,
  TargetSelector,
  onEdgeCreate,
  Row,
  Button,
  Icon,
  SelectWithCombobox,
  Label,
  stackClasses,
} from "@open-decision/design-system";
import { sidebarCardClasses } from "@open-decision/node-editor";
import {
  CompareEdgePlugin,
  ICompareEdge,
} from "@open-decision/plugins-edge-compare";
import {
  SelectInputPlugin,
  TNodeSidebarProps,
} from "@open-decision/plugins-node-helpers";
import { useTree, useTreeClient } from "@open-decision/tree-sync";
import { TNodeId } from "@open-decision/tree-ids";
import { ODProgrammerError } from "@open-decision/type-classes";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { Controller, useFieldArray } from "react-hook-form";
import { DecisionNodePlugin } from "../DecisionNodePlugin";

const DecisionNode = new DecisionNodePlugin();
const SelectInput = new SelectInputPlugin();
const CompareEdge = new CompareEdgePlugin();

type Props = {
  nodeId: TNodeId;
  edge: ICompareEdge;
  onEdgeCreate: onEdgeCreate;
} & Pick<TNodeSidebarProps, "onNodeCreate">;

export function PathCard({ onNodeCreate, onEdgeCreate, nodeId, edge }: Props) {
  const nodeOptions = useTree((treeClient) =>
    Object.values(treeClient.nodes.get.options(nodeId, "Ohne Name"))
  );
  const treeClient = useTreeClient();

  const inputAnswers = useTree((treeClient) => {
    const input = DecisionNode.inputs.getByNode(nodeId)(treeClient);

    if (input instanceof ODProgrammerError) return undefined;

    return input?.answers;
  });

  const targetName = useTree((treeClient) =>
    edge.target
      ? treeClient.nodes.get.single(edge.target)?.name ??
        "Zielknoten ohne Namen"
      : undefined
  );

  const targetFormMethods = Form.useForm({
    defaultValues: { target: targetName },
  });

  const conditionFormMethods = Form.useForm({
    defaultValues: {
      [edge.id]: edge.condition.valueIds.map((valueId) => ({
        value: inputAnswers?.find((answer) => answer.id === valueId)?.value,
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: conditionFormMethods.control,
    name: edge.id,
  });

  const inputId = useTree((treeClient) => {
    const input = DecisionNode.inputs.getByNode(nodeId)(treeClient);

    if (input instanceof ODProgrammerError) return undefined;

    return input?.id;
  });

  return (
    <section className={stackClasses({}, sidebarCardClasses)}>
      <Form.Root methods={targetFormMethods}>
        <Row className="justify-between w-full">
          <Label htmlFor="target">Ziel</Label>
          <Button
            size="small"
            variant="neutral"
            type="button"
            onClick={() => {
              treeClient.edges.delete([edge.id]);
            }}
          >
            <Icon>
              <CrossCircledIcon />
            </Icon>
          </Button>
        </Row>
        <TargetSelector
          id="target"
          name="target"
          onEdgeCreate={onEdgeCreate}
          onNodeCreate={onNodeCreate}
          edge={edge}
          nodeId={nodeId}
          selectOptions={nodeOptions}
        />
      </Form.Root>
      <Row className="justify-between">
        <Form.Label>(wenn) Bedingungen</Form.Label>
        <Button
          variant="secondary"
          size="small"
          onClick={() => {
            append({ value: "" });
            return CompareEdge.addValue(edge.id, "")(treeClient);
          }}
        >
          Hinzufügen
        </Button>
      </Row>
      <Form.Root methods={conditionFormMethods}>
        {fields.map((field, index) => {
          return (
            <Row className="justify-between gap-2" key={field.id}>
              <Controller
                name={`${edge.id}.${index}.value`}
                control={conditionFormMethods.control}
                render={({ field }) => (
                  <SelectWithCombobox
                    {...field}
                    onSelect={(newItem) => {
                      if (!newItem) return;

                      return CompareEdge.updateValue(
                        edge.id,
                        index,
                        newItem
                      )(treeClient);
                    }}
                    onCreate={(value) => {
                      if (!inputId) return;

                      const newAnswer = SelectInput.createAnswer({ value });
                      SelectInput.addAnswer(inputId, newAnswer)(treeClient);

                      return CompareEdge.updateValue(
                        edge.id,
                        index,
                        newAnswer.id
                      )(treeClient);
                    }}
                    selectOptions={
                      inputAnswers
                        ?.map((answer) => ({
                          id: answer.id,
                          name: answer.value,
                        }))
                        .filter(
                          (answer): answer is { id: string; name: string } =>
                            !!answer.name
                        ) ?? []
                    }
                    className="flex-1"
                    selectPlaceholder="Antwort auswählen..."
                    withClearButton={false}
                  />
                )}
              />
              <Button
                variant="neutral"
                size="small"
                onClick={() => {
                  remove(index);
                  return CompareEdge.removeValue(edge.id, index)(treeClient);
                }}
              >
                <Icon>
                  <CrossCircledIcon />
                </Icon>
              </Button>
            </Row>
          );
        })}
      </Form.Root>
    </section>
  );
}
