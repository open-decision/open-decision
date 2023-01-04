import { useTreeClient } from "@open-decision/tree-sync";
import { Edge, Node, TTreeClient } from "@open-decision/tree-type";
import { ODError } from "@open-decision/type-classes";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { Form, SelectWithCombobox, SelectWithComboboxProps } from "../Form";
import { Row } from "../Layout";
import { addNotification } from "../Notifications";

export type onNodeCreate = (
  data: Pick<Node.TNode, "name">
) => (treeClient: TTreeClient) => Node.TNode;

export type onEdgeCreate = (
  data: Pick<Edge.TEdge, "source" | "target">
) => (treeClient: TTreeClient) => Edge.TEdge | ODError;

export type onTargetUpdate = (newTarget?: string) => void;

export type TargetSelectorProps = {
  name: string;
  nodeId: string;
  inputClassName?: string;
  className?: string;
  edge: Edge.TEdge;
  onNodeCreate: onNodeCreate;
  onEdgeCreate: onEdgeCreate;
  onTargetUpdate?: onTargetUpdate;
} & Pick<SelectWithComboboxProps, "selectOptions" | "id" | "withClearButton">;

export function TargetSelector({
  name,
  edge,
  nodeId,
  onEdgeCreate,
  onNodeCreate,
  onTargetUpdate,
  inputClassName,
  selectOptions,
  className,
  id,
  withClearButton,
}: TargetSelectorProps) {
  const t = useTranslations("common.errors");
  const { control } = Form.useFormContext();
  const treeClient = useTreeClient();

  return (
    <Row className={className}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          return (
            <SelectWithCombobox
              {...field}
              id={id}
              onCreate={(value) => {
                const childNode = treeClient.nodes.create.childNode(
                  nodeId,
                  onNodeCreate({ name: value })(treeClient)
                );

                const newEdge = onEdgeCreate({
                  source: nodeId,
                  target: childNode.id,
                })(treeClient);

                if (newEdge instanceof ODError) {
                  return addNotification({
                    title: t(`${newEdge.code}.short`),
                    content: t(`${newEdge.code}.long`),
                    variant: "danger",
                  });
                }

                if (!edge) {
                  treeClient.edges.add(newEdge);
                } else {
                  treeClient.edges.update(edge.id, newEdge);
                }

                treeClient.nodes.add(childNode);
              }}
              onSelect={(newTarget) => {
                const newEdge = onEdgeCreate({
                  source: nodeId,
                  target: newTarget,
                })(treeClient);

                if (newEdge instanceof ODError) {
                  return addNotification({
                    title: t(`${newEdge.code}.short`),
                    content: t(`${newEdge.code}.long`),
                    variant: "danger",
                  });
                }

                if (!edge) {
                  treeClient.edges.add(newEdge);
                } else {
                  treeClient.edges.update(edge.id, newEdge);
                }

                return onTargetUpdate?.(newTarget);
              }}
              selectOptions={selectOptions}
              comboboxPlaceholder={
                selectOptions.length
                  ? "Knoten suchen..."
                  : "Neuen Knoten erstellen..."
              }
              selectPlaceholder="Zielknoten auswählen..."
              className={`flex-1 rounded-md ${inputClassName}`}
              withClearButton={withClearButton}
            />
          );
        }}
      />
    </Row>
  );
}
