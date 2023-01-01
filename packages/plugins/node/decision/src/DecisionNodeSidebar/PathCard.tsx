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
  TCompareEdge,
} from "@open-decision/plugins-edge-compare";
import { TNodeSidebarProps } from "@open-decision/plugins-node-helpers";
import { useTree, useTreeClient } from "@open-decision/tree-sync";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { Controller, useFieldArray } from "react-hook-form";
import { DecisionNodePlugin } from "../decisionNodePlugin";

const DecisionNode = new DecisionNodePlugin();
const CompareEdge = new CompareEdgePlugin();

type Props = {
  nodeId: string;
  edge: TCompareEdge;
  onEdgeCreate: onEdgeCreate;
} & Pick<TNodeSidebarProps, "onNodeCreate">;

export function PathCard({ onNodeCreate, onEdgeCreate, nodeId, edge }: Props) {
  const nodeOptions = useTree((treeClient) =>
    Object.values(treeClient.nodes.get.options(nodeId, "Ohne Name"))
  );
  const treeClient = useTreeClient();

  const inputAnswers = useTree((treeClient) => {
    return DecisionNode.getInputByNode(nodeId)(treeClient)?.data.answers;
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
      [edge.id]: edge.data.condition.valueIds.map((valueId) => ({
        value: inputAnswers?.find((answer) => answer.id === valueId)?.value,
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: conditionFormMethods.control,
    name: edge.id,
  });

  return (
    <section className={stackClasses({}, sidebarCardClasses)}>
      <Form.Root methods={targetFormMethods}>
        <Form.Field
          Label={
            <Row className="justify-between w-full">
              <Label>Ziel</Label>
              <Button
                size="small"
                variant="neutral"
                onClick={() => {
                  treeClient.edges.delete([edge.id]);
                }}
              >
                <Icon>
                  <CrossCircledIcon />
                </Icon>
              </Button>
            </Row>
          }
        >
          <TargetSelector
            name="target"
            onEdgeCreate={onEdgeCreate}
            onNodeCreate={onNodeCreate}
            edge={edge}
            nodeId={nodeId}
            selectOptions={nodeOptions}
          />
        </Form.Field>
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
            <Row className="justify-between" key={field.id}>
              <Controller
                name={`${edge.id}.${index}.value`}
                control={conditionFormMethods.control}
                render={({ field }) => (
                  <SelectWithCombobox
                    {...field}
                    onSelect={(newItem) =>
                      CompareEdge.updateValue(
                        edge.id,
                        index,
                        newItem
                      )(treeClient)
                    }
                    selectOptions={
                      inputAnswers?.map((answer) => ({
                        id: answer.id,
                        name: answer.value,
                      })) ?? []
                    }
                    className="flex-1"
                    selectPlaceholder="Antwort auswählen..."
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
